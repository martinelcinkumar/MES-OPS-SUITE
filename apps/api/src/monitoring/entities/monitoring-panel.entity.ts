import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { MonitoringPanelType } from '../../common/enums';
import { Team } from '../../teams/entities/team.entity';

/**
 * Replaces the demo's localStorage-based panel URL persistence
 * (`mon_url_<team>_<idx>`). `src` is stored/served by our API; the Angular
 * <iframe> that ultimately embeds Grafana/Kibana still navigates the browser
 * directly to that URL — see plan notes on why that's not a "frontend calls
 * a third-party API" violation.
 */
@Entity('monitoring_panels')
export class MonitoringPanel extends BaseEntity {
  @Column()
  teamId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  title: string;

  @Column({ type: 'simple-enum', enum: MonitoringPanelType })
  type: MonitoringPanelType;

  @Column({ nullable: true })
  src: string | null;

  @Column({ default: '' })
  description: string;

  @Column({ default: 0 })
  sortOrder: number;
}
