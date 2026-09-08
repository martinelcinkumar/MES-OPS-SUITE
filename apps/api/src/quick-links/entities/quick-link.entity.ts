import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('quick_links')
export class QuickLink extends BaseEntity {
  @Column()
  teamId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: '#e3f0fc' })
  iconBg: string;

  @Column({ default: '#3d8ef0' })
  iconColor: string;

  @Column({ default: 0 })
  sortOrder: number;
}
