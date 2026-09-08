import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Team } from '../../teams/entities/team.entity';

/**
 * Mirrors an ITSM "assignment group" (e.g. "MES Platform IFP",
 * "MES Platform Foundations"). Names come from the ITSM tool's own naming
 * convention, which doesn't line up 1:1 with our internal Team.name, so this
 * is its own lookup table rather than reusing Team directly. teamId is a
 * best-effort, optional cross-link for reporting when a group clearly maps
 * to one of our internal teams.
 */
@Entity('ticket_assignment_groups')
@Unique(['name'])
export class TicketAssignmentGroup extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  teamId: string | null;

  @ManyToOne(() => Team, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Team | null;
}
