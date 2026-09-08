import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { SupportLevel } from '../../common/enums';
import { TeamMember } from './team-member.entity';

@Entity('teams')
@Unique(['slug'])
export class Team extends BaseEntity {
  @Column()
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'simple-enum',
    enum: SupportLevel,
    default: SupportLevel.PLATINUM,
  })
  supportLevel: SupportLevel;

  @OneToMany(() => TeamMember, (member) => member.team)
  members: TeamMember[];
}
