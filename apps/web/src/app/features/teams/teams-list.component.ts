import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamsService } from '../../core/api/teams.service';
import { Team } from '../../core/models/team.model';
import { IconComponent } from '../../shared/icon/icon.component';
import { TeamFormDialogComponent } from './team-form-dialog.component';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    IconComponent,
  ],
  templateUrl: './teams-list.component.html',
  styleUrl: './teams-list.component.scss',
})
export class TeamsListComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly teams = signal<Team[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.teamsService.list().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load teams', 'Dismiss', {
          duration: 4000,
        });
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
        next: () => {
          this.snackBar.open(`${result.name} created`, undefined, {
            duration: 3000,
          });
          this.load();
        },
        error: (err) => {
          this.snackBar.open(
            err.error?.message ?? 'Failed to create team',
            'Dismiss',
            { duration: 4000 },
          );
        },
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
      next: () => {
        this.snackBar.open(`${team.name} deleted`, undefined, {
          duration: 3000,
        });
        this.load();
      },
      error: () => {
        this.snackBar.open('Failed to delete team', 'Dismiss', {
          duration: 4000,
        });
      },
    });
  }
}
