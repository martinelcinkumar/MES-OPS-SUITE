# MES Operations Suite — Angular + NestJS + SQL Server Rebuild

## Context

`MES_OPS_SUITE_V2_Roadshow_Demo.html` is a single-file demo (3,901 lines) for an internal
Bosch MES operations tool. It currently either reads/writes SharePoint lists directly from
the browser (`SP_CONFIG`, `spGet/spAdd/spUpdate/spDelete` around line 750–900) or falls back
to hardcoded in-memory arrays. This must become a real three-tier app — Angular frontend,
NestJS REST API, SQL Server via TypeORM — with one hard rule: **the browser only ever talks
to our own NestJS API.** SharePoint is removed entirely; no other third-party/public API is
called from the frontend. The repo (`/home/user/MES-OPS-SUITE`) is currently empty, so this
is a greenfield scaffold, not a migration of existing code.

Four schema-shaping questions were resolved with the user before writing this plan:
- **Tickets**: assigned to ITSM assignment groups (e.g. "MES Platform IFP", "MES Platform
  Foundations") whose names come from the ITSM tool, not straight from `Team.name`.
- **Portals**: stay a team-independent infrastructure registry (division/plant/site/cluster),
  no `teamId`.
- **Chatbot**: keep canned replies for now, but behind a swappable provider interface so a
  real (internal) LLM can be dropped in later.
- **Escalation matrix**: the team roster is expanded to cover every label already used in the
  demo's escalation data (`CORE`, `OPCON`, `PDC`, `PTrace`, plus the existing 6 teams), and
  `EscalationMatrix.teamId` becomes a required FK — no more free-text-only team labels.

## Data Model (SQL Server via TypeORM)

All entities get `id` (uuid PK), and `createdAt`/`updatedAt` (except join/config-only tables
noted otherwise). Enums are Postgres-agnostic TypeORM `enum` columns (SQL Server maps these to
`nvarchar` + check constraint).

| Entity | Key fields | Relations |
|---|---|---|
| **Team** | slug (unique), name, description, supportLevel (`platinum`\|`gold`\|`standard`) | 1—N TeamMember, Ticket assignment groups (via group), EscalationMatrix, KBArticle, QuickLink, MonitoringPanel, ChatMessage |
| **TeamMember** | firstName, lastName, email (unique), role, avatarColor | N—1 Team |
| **TicketAssignmentGroup** | name (unique, e.g. "MES Platform IFP") | N—1 Team (nullable, best-effort cross-link for reporting) |
| **Ticket** | ref (unique, `INC-####`), title, description, priority enum, status enum | N—1 TicketAssignmentGroup (required), N—1 TeamMember as assignee (nullable) |
| **Portal** | division, location, plant, sap, site, url, cluster, namespace, environment enum (`PROD`\|`QA`\|`DEV`) | none (standalone registry, per decision) |
| **EscalationMatrix** | name, role, colorHex, sortOrder, onDuty (bool) | N—1 Team (required), N—1 TeamMember (nullable, optional link) |
| **CalendarEvent** | title, type enum, eventDate | N—1 Team (nullable — calendar stays global by default, matching demo) |
| **KBArticle** | title, category enum, body, tag, externalUrl (nullable — plain hyperlink to Confluence, not an API call), viewCount | N—1 Team (required) |
| **QuickLink** | name, url, description, iconBg, iconColor, sortOrder | N—1 Team (required) |
| **MonitoringPanel** | title, type enum (`grafana`\|`kibana`\|`iframe`), src (nullable URL), description, sortOrder | N—1 Team (required) — replaces the demo's `localStorage` persistence |
| **User** | email (unique, from SSO), firstName, lastName, jobTitle, avatarColor, role (`admin`\|`member`), lastLoginAt | 1—1 UserPreference, 1—N Notification, 1—N ChatMessage |
| **UserPreference** | emailNotifications, browserNotifications, dailyDigest, slaAlerts, compactSidebar, denseMode, animations (all bool) | 1—1 User |
| **Notification** | title, message, read (bool) | N—1 User (nullable = broadcast) |
| **ChatMessage** | role (`user`\|`bot`), text | N—1 Team (required), N—1 User (required — history is per user *and* per team) |

Note on the escalation roster expansion: add `Team` rows for `CORE`, `OPCON`, `PDC`, `PTrace`
alongside the existing `ifp`, `core13`, `core2`, `ds4w`, `found`, `opcua`. These new teams will
start with empty rosters/dashboards/KB — that's expected; they get populated through the same
CRUD the other teams use.

**Grafana/Kibana panels**: `MonitoringPanel.src` is stored/served by our API, but the rendered
`<iframe src="...">` in Angular still navigates the browser directly to the internal
Grafana/Kibana URL — same as the demo. This is a browser *navigation*, not a `fetch`/`XHR` call
made by Angular code, and Grafana/Kibana are internal tools being embedded, not third-party
APIs being called for data. Flagging this explicitly since it's the one place the browser talks
to something other than our API — happy to change this if you want it treated differently.

**Settings → Security**: password change is removed from the panel (SSO/AD owns credentials);
replaced with a static "managed by your organization's identity provider" notice. Profile,
Notifications, and Appearance panels remain, backed by `User`/`UserPreference`.

## NestJS Structure (Express adapter, REST, TypeORM)

```
apps/api/src/
  auth/            AuthModule — SSO strategy boundary (stubbed), issues our own JWT
  users/           UsersModule — User, UserPreference
  teams/           TeamsModule — Team, TeamMember (nested CRUD)
  tickets/         TicketsModule — Ticket, TicketAssignmentGroup, ITSM metrics endpoint
  portals/         PortalsModule — Portal (env filter + search)
  escalation/      EscalationModule — EscalationMatrix
  calendar/        CalendarModule — CalendarEvent (month-range query)
  kb/              KbModule — KBArticle (search + category filter)
  quick-links/     QuickLinksModule — QuickLink (per team)
  monitoring/      MonitoringModule — MonitoringPanel (per team)
  notifications/   NotificationsModule — Notification (list mine / mark read)
  chat/            ChatModule — ChatMessage + ChatReplyProvider interface
                     (CannedReplyProvider default impl, DI token CHAT_REPLY_PROVIDER)
  dashboard/       DashboardModule — StatsService (Home/Dashboards/ITSM aggregates),
                     SearchController (global topbar search across Team/Ticket/Portal/KB)
  common/          base entity, enums, DTOs, exception filter, pagination helper
  config/          typeorm.config.ts (SQL Server via env vars), app config
```

- `AuthModule` exposes `AuthGuard`, `RolesGuard`, `@CurrentUser()` decorator, and a
  `SsoStrategy` interface with a dev-only stub implementation (e.g. a fixed/mock user) so every
  other module can depend on "there is an authenticated user" without SAML/OIDC being wired
  yet. Real SAML/OIDC (passport-saml or openid-client) replaces the stub behind this same
  boundary in the dedicated SSO step at the end.
- Every write endpoint validates via `class-validator` DTOs; every list endpoint supports
  pagination + filtering consistent with how the demo's tables/filters work (ticket status
  filter, portal env tabs, KB category/search, etc.).

## Angular Structure (standalone components, Angular Material)

```
apps/web/src/app/
  core/
    auth/          AuthService, authGuard, authInterceptor (attaches JWT)
    api/            *.service.ts per backend module (typed HttpClient wrappers)
    models/         TS interfaces mirroring API DTOs
  layout/           ShellComponent, SidebarComponent, TopbarComponent (search, bell, user menu)
  features/
    home/
    dashboards/     monthly/yearly toggle, stat cards, bar chart, SLA rings
    portals/        env tabs, search, table, add/edit dialog
    oncall/         escalation list, duty stats, recent incidents
    calendar/       month grid, upcoming list, add-event dialog
    itsm/           metrics view + tickets view (filters), create/view ticket dialog
    team/           TeamShellComponent, child routes: roster, dashboard (monitoring), 
                     quick-links, chatbot, kb — routed as /team/:slug/:tab
    settings/       profile, notifications, appearance (security = static SSO notice)
    help/
  shared/           StatCard, Tag/Badge, ConfirmDialog, ToastService (MatSnackBar wrapper)
  styles/           global SCSS translating the demo's CSS custom properties
                     (--blue, --green, --red, card/badge/tag tokens) into an Angular Material
                     theme + shared utility classes
```

Routing is lazy-loaded per feature, guarded by `authGuard`. No component ever imports
`HttpClient` directly against anything but our own `/api/...` base URL — enforced by only
exposing `core/api/*.service.ts` wrappers to feature code.

## Build Order (as specified)

1. Scaffold NestJS (Nest CLI monorepo or single app), wire TypeORM against SQL Server running
   in Docker locally (fall back to SQLite only if Docker SQL Server is unavailable in this
   sandbox — real corporate SQL Server at deploy time either way), generate initial migration
   for the full entity set above.
2. Build `/teams` and `/teams/:id/members` CRUD end-to-end, verify with a REST client (curl /
   Postman-style requests) against the running API + DB.
3. Scaffold the Angular workspace (standalone bootstrap, Angular Material, routing shell),
   wire the Teams feature to those first endpoints, confirm in a real browser session.
4. Go module-by-module for the rest (Portals → Tickets/ITSM → Escalation/On-Call → Calendar →
   KB → Quick Links → Monitoring → Notifications → Chat → Dashboard/Search), replacing static
   data with real API calls one module at a time, each reviewable before moving on.
5. SSO/AD (SAML or OIDC) is the final step, replacing the `AuthModule` stub — no restructuring
   needed elsewhere since every module already depends only on the `AuthGuard`/`@CurrentUser()`
   boundary.

## Verification

- Each backend module: `npm run start:dev` + exercise its endpoints (list/create/update/delete)
  against the real SQL Server (or SQLite/Docker fallback) before moving to the next module.
- Each frontend module: `ng serve`, click through the actual page in a browser (golden path +
  at least one edge case, e.g. empty state for a newly-added team with no roster yet).
- After each vertical slice (steps 2–3), confirm with the user before continuing to the next
  module per the explicit build order.
