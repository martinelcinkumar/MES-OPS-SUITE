import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference extends BaseEntity {
  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.preference, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  browserNotifications: boolean;

  @Column({ default: false })
  dailyDigest: boolean;

  @Column({ default: true })
  slaAlerts: boolean;

  @Column({ default: false })
  compactSidebar: boolean;

  @Column({ default: false })
  denseMode: boolean;

  @Column({ default: true })
  animations: boolean;
}
