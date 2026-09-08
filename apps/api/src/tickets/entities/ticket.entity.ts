import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { TicketPriority, TicketStatus } from '../../common/enums';
import { TeamMember } from '../../teams/entities/team-member.entity';
import { TicketAssignmentGroup } from './ticket-assignment-group.entity';

@Entity('tickets')
@Unique(['ref'])
export class Ticket extends BaseEntity {
  @Column()
  ref: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'simple-enum', enum: TicketPriority })
  priority: TicketPriority;

  @Column({
    type: 'simple-enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column()
  assignmentGroupId: string;

  @ManyToOne(() => TicketAssignmentGroup, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'assignmentGroupId' })
  assignmentGroup: TicketAssignmentGroup;

  @Column({ nullable: true })
  assigneeId: string | null;

  @ManyToOne(() => TeamMember, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee: TeamMember | null;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date | null;
}
