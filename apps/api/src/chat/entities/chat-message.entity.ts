import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ChatMessageRole } from '../../common/enums';
import { Team } from '../../teams/entities/team.entity';
import { User } from '../../users/entities/user.entity';

@Entity('chat_messages')
export class ChatMessage extends BaseEntity {
  @Column()
  teamId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'simple-enum', enum: ChatMessageRole })
  role: ChatMessageRole;

  @Column({ type: 'text' })
  text: string;
}
