import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamsService } from '../../core/api/teams.service';
import { Team, TeamMember } from '../../core/models/team.model';
import { IconComponent } from '../../shared/icon/icon.component';
import { MemberFormDialogComponent } from './member-form-dialog.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, IconComponent],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.scss',
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly team = signal<Team | null>(null);
  readonly members = signal<TeamMember[]>([]);
  readonly loading = signal(true);

  private teamId = '';

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.teamsService.get(this.teamId).subscribe({
      next: (team) => this.team.set(team),
      error: () => {
        this.snackBar.open('Team not found', 'Dismiss', { duration: 4000 });
        this.router.navigate(['/teams']);
      },
    });
    this.teamsService.listMembers(this.teamId).subscribe({
      next: (members) => {
        this.members.set(members);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  initials(m: TeamMember): string {
    return (m.firstName[0] ?? '') + (m.lastName?.[0] ?? '');
  }

  openAddMemberDialog(): void {
    const ref = this.dialog.open(MemberFormDialogComponent, {
      width: '480px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.teamsService.addMember(this.teamId, result).subscribe({
        next: () => {
          this.snackBar.open('Member added', undefined, { duration: 3000 });
          this.load();
        },
        error: (err) => {
          this.snackBar.open(
            err.error?.message ?? 'Failed to add member',
            'Dismiss',
            { duration: 4000 },
          );
        },
      });
    });
  }

  removeMember(member: TeamMember): void {
    if (!confirm(`Remove ${member.firstName} ${member.lastName} from this team?`)) {
      return;
    }
    this.teamsService.removeMember(this.teamId, member.id).subscribe({
      next: () => {
        this.snackBar.open('Member removed', undefined, { duration: 3000 });
        this.load();
      },
      error: () => {
        this.snackBar.open('Failed to remove member', 'Dismiss', {
          duration: 4000,
        });
      },
    });
  }
}
