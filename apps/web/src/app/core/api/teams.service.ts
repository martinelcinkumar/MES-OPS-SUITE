import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateTeam,
  CreateTeamMember,
  Team,
  TeamMember,
  UpdateTeam,
  UpdateTeamMember,
} from '../models/team.model';

/**
 * Only place in the app allowed to know the /teams API shape. Feature
 * components go through this service — never HttpClient directly — and it
 * only ever talks to our own NestJS API (environment.apiBaseUrl).
 *
 * `teams` is shared, app-wide state: the sidebar's team list/count and the
 * Teams list page both read the same signal, so a create/rename/delete from
 * either place is reflected everywhere immediately instead of each holding
 * its own stale local copy.
 */
@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/teams`;

  private readonly _teams = signal<Team[]>([]);
  readonly teams = this._teams.asReadonly();

  /** Refetches the team list and updates the shared `teams` signal. */
  refresh(): Observable<Team[]> {
    return this.list().pipe(tap((teams) => this._teams.set(teams)));
  }

  list(): Observable<Team[]> {
    return this.http.get<Team[]>(this.base);
  }

  get(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.base}/${id}`);
  }

  create(dto: CreateTeam): Observable<Team> {
    return this.http.post<Team>(this.base, dto).pipe(tap(() => this.refresh().subscribe()));
  }

  update(id: string, dto: UpdateTeam): Observable<Team> {
    return this.http
      .patch<Team>(`${this.base}/${id}`, dto)
      .pipe(tap(() => this.refresh().subscribe()));
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.base}/${id}`)
      .pipe(tap(() => this.refresh().subscribe()));
  }

  listMembers(teamId: string): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.base}/${teamId}/members`);
  }

  addMember(teamId: string, dto: CreateTeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(`${this.base}/${teamId}/members`, dto);
  }

  updateMember(
    teamId: string,
    memberId: string,
    dto: UpdateTeamMember,
  ): Observable<TeamMember> {
    return this.http.patch<TeamMember>(
      `${this.base}/${teamId}/members/${memberId}`,
      dto,
    );
  }

  removeMember(teamId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${teamId}/members/${memberId}`);
  }
}
