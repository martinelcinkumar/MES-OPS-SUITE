import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { HomeComponent } from './features/home/home.component';
import { TeamsListComponent } from './features/teams/teams-list.component';
import { TeamDetailComponent } from './features/teams/team-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomeComponent },
      { path: 'teams', component: TeamsListComponent },
      { path: 'teams/:id', component: TeamDetailComponent },
    ],
  },
];
