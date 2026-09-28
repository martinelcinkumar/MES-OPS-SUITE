import { Component, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TeamsService } from '../../core/api/teams.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { ToastService } from '../../shared/toast/toast.service';
import { TeamFormDialogComponent } from '../../features/teams/team-form-dialog.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) route = route.firstChild;
        return (route?.snapshot.data['title'] as string | undefined) ?? 'MES Operations Suite';
      }),
    ),
    { initialValue: 'MES Operations Suite' },
  );

  readonly navItems = [
    { label: 'Home', icon: 'home', path: '/home' },
    { label: 'Dashboards', icon: 'dashboard', path: '/dashboards' },
    { label: 'MES Portals', icon: 'portals', path: '/portals' },
    { label: 'On Call Support', icon: 'oncall', path: '/oncall' },
    { label: 'Calendar', icon: 'calendar', path: '/calendar' },
    { label: 'ITSM', icon: 'itsm', path: '/itsm' },
  ];

  readonly teams = this.teamsService.teams;

  ngOnInit(): void {
    this.teamsService.refresh().subscribe({
      error: () => this.toast.show('Failed to load teams', '', 'error'),
    });
  }

  openOps360Toast(): void {
    this.toast.show(
      'OPS360 coming soon',
      'The MES OPS360 Assistant is not yet configured.',
      'info',
    );
  }

  openAddTeamDialog(): void {
    const ref = this.dialog.open(TeamFormDialogComponent, {
      width: '480px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.teamsService.create(result).subscribe({
        next: (team) => {
          this.toast.show(`${team.name} created`, '', 'success');
          this.router.navigate(['/teams', team.id]);
        },
        error: (err) => {
          this.toast.show(err.error?.message ?? 'Failed to create team', '', 'error');
        },
      });
    });
  }
}
