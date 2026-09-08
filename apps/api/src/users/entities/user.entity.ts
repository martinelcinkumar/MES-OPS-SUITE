import { Column, Entity, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { AvatarColor, UserRole } from '../../common/enums';
import { UserPreference } from './user-preference.entity';

/**
 * Populated via JIT provisioning on first SSO login (see AuthModule). No
 * password/credential fields — the IdP owns authentication entirely.
 */
@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column({ default: '' })
  lastName: string;

  @Column({ nullable: true })
  jobTitle: string | null;

  @Column({
    type: 'simple-enum',
    enum: AvatarColor,
    default: AvatarColor.AV1,
  })
  avatarColor: AvatarColor;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date | null;

  @OneToOne(() => UserPreference, (pref) => pref.user)
  preference: UserPreference;
}
