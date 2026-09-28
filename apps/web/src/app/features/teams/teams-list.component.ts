import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TeamsService } from '../../core/api/teams.service';
import { Team } from '../../core/models/team.model';
import { IconComponent } from '../../shared/icon/icon.component';
import { ToastService } from '../../shared/toast/toast.service';
import { TeamFormDialogComponent } from './team-form-dialog.component';

@Component({
  selector: 'app-teams-list',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatChipsModule, IconComponent],
  templateUrl: './teams-list.component.html',
  styleUrl: './teams-list.component.scss',
})
export class TeamsListComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);

  readonly teams = this.teamsService.teams;
  readonly loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.teamsService.refresh().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.toast.show('Failed to load teams', '', 'error');
      },
    });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(TeamFormDialogComponent, {
      width: '480px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.teamsService.create(result).subscribe({
        next: () => this.toast.show(`${result.name} created`, '', 'success'),
        error: (err) => this.toast.show(err.error?.message ?? 'Failed to create team', '', 'error'),
      });
    });
  }

  deleteTeam(team: Team, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!confirm(`Delete team "${team.name}"? This cannot be undone.`)) {
      return;
    }
    this.teamsService.remove(team.id).subscribe({
      next: () => this.toast.show(`${team.name} deleted`, '', 'success'),
      error: () => this.toast.show('Failed to delete team', '', 'error'),
    });
  }
}
