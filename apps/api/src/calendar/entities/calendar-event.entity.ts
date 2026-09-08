import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { CalendarEventType } from '../../common/enums';
import { Team } from '../../teams/entities/team.entity';

@Entity('calendar_events')
export class CalendarEvent extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'simple-enum', enum: CalendarEventType })
  type: CalendarEventType;

  @Column({ type: 'datetime' })
  eventDate: Date;

  @Column({ nullable: true })
  teamId: string | null;

  @ManyToOne(() => Team, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Team | null;
}
