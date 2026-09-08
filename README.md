# MES Operations Suite

Angular + NestJS + SQL Server rebuild of the internal MES Operations Suite
(previously a single-file static HTML/JS demo backed directly by SharePoint).
See `PLAN.md` for the full architecture, data model, and build order this is
following.

**Hard constraint:** the Angular frontend only ever calls this repo's own
NestJS API. No SharePoint, no third-party/public API calls from the browser.

## Structure

```
apps/
  api/   NestJS REST API (TypeORM, SQL Server / SQLite dev fallback)
  web/   Angular app (standalone components, Angular Material)
```

## Running locally

### API (`apps/api`)

```bash
cd apps/api
npm install
npm run migration:run   # creates/updates the local SQLite dev DB (data/dev.sqlite)
npm run start:dev       # http://localhost:3000, routes under /api
```

By default `DB_DRIVER=sqlite` (see `.env`) — no external database needed for
local dev. Set `DB_DRIVER=mssql` plus the `DB_HOST`/`DB_USERNAME`/etc. vars
(see `.env.example`) to point at a real SQL Server instance instead.

### Web (`apps/web`)

```bash
cd apps/web
npm install
npm start   # http://localhost:4200, proxies API calls to http://localhost:3000/api
```

## Status

Currently implemented end-to-end: **Teams** (create/list/edit/delete teams,
manage team rosters). This was the first vertical slice built to validate
the full stack — remaining modules (Portals, ITSM/Tickets, On-Call/
Escalation, Calendar, KB, Quick Links, Monitoring, Notifications, Chat, SSO)
follow the same pattern, one at a time, per `PLAN.md`.
