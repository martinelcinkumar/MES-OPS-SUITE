export type SupportLevel = 'platinum' | 'gold' | 'standard';

export interface Team {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  supportLevel: SupportLevel;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeam {
  slug: string;
  name: string;
  description?: string;
  supportLevel?: SupportLevel;
}

export type UpdateTeam = Partial<CreateTeam>;

export type MemberRole =
  | 'OPS Lead'
  | 'OPS Specialist'
  | 'Lead Engineer'
  | 'Systems Engineer'
  | 'Data Engineer'
  | 'QA Specialist'
  | 'Architect'
  | 'Analyst';

export type AvatarColor =
  | 'av1' | 'av2' | 'av3' | 'av4' | 'av5' | 'av6' | 'av7' | 'av8';

export interface TeamMember {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: MemberRole;
  avatarColor: AvatarColor;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMember {
  firstName: string;
  lastName?: string;
  email: string;
  role: MemberRole;
  avatarColor?: AvatarColor;
}

export type UpdateTeamMember = Partial<CreateTeamMember>;
