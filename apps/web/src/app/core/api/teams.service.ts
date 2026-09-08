import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
 */
@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/teams`;

  list(): Observable<Team[]> {
    return this.http.get<Team[]>(this.base);
  }

  get(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.base}/${id}`);
  }

  create(dto: CreateTeam): Observable<Team> {
    return this.http.post<Team>(this.base, dto);
  }

  update(id: string, dto: UpdateTeam): Observable<Team> {
    return this.http.patch<Team>(`${this.base}/${id}`, dto);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
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
