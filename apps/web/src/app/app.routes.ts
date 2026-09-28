import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { HomeComponent } from './features/home/home.component';
import { TeamsListComponent } from './features/teams/teams-list.component';
import { TeamDetailComponent } from './features/teams/team-detail.component';
import { ComingSoonComponent } from './shared/coming-soon/coming-soon.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent, data: { title: 'Home' } },
      { path: 'teams', component: TeamsListComponent, data: { title: 'Teams' } },
      { path: 'teams/:id', component: TeamDetailComponent, data: { title: 'Team Space' } },
      {
        path: 'dashboards',
        component: ComingSoonComponent,
        data: { title: 'Dashboards', description: 'SLA, monthly overview, production monitor.' },
      },
      {
        path: 'portals',
        component: ComingSoonComponent,
        data: { title: 'MES Portals', description: 'Access Prod, QA & Dev environments.' },
      },
      {
        path: 'oncall',
        component: ComingSoonComponent,
        data: { title: 'On Call Support', description: '24/7 platinum support team & escalation matrix.' },
      },
      {
        path: 'calendar',
        component: ComingSoonComponent,
        data: { title: 'Calendar', description: 'Announcements & maintenance schedule.' },
      },
      {
        path: 'itsm',
        component: ComingSoonComponent,
        data: { title: 'ITSM', description: 'Incident management system.' },
      },
      {
        path: 'settings',
        component: ComingSoonComponent,
        data: { title: 'Settings', description: 'Profile, notifications, appearance & security.' },
      },
      {
        path: 'help',
        component: ComingSoonComponent,
        data: { title: 'Help & Support', description: 'Documentation and support resources.' },
      },
    ],
  },
];
