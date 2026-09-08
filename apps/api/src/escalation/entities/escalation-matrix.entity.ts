import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Team } from '../../teams/entities/team.entity';
import { TeamMember } from '../../teams/entities/team-member.entity';

@Entity('escalation_matrix')
export class EscalationMatrix extends BaseEntity {
  @Column()
  teamId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ nullable: true })
  memberId: string | null;

  @ManyToOne(() => TeamMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'memberId' })
  member: TeamMember | null;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ default: '#666666' })
  colorHex: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  onDuty: boolean;
}
