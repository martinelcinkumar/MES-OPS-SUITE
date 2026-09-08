import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { AvatarColor, MemberRole } from '../../common/enums';
import { Team } from './team.entity';

@Entity('team_members')
@Unique(['email'])
export class TeamMember extends BaseEntity {
  @Column()
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column()
  email: string;

  @Column({ type: 'simple-enum', enum: MemberRole })
  role: MemberRole;

  @Column({
    type: 'simple-enum',
    enum: AvatarColor,
    default: AvatarColor.AV1,
  })
  avatarColor: AvatarColor;

  @Column()
  teamId: string;

  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;
}
