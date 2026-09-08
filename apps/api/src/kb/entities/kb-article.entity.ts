import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { KbCategory } from '../../common/enums';
import { Team } from '../../teams/entities/team.entity';

@Entity('kb_articles')
export class KBArticle extends BaseEntity {
  @Column()
  teamId: string;

  @ManyToOne(() => Team, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  title: string;

  @Column({ type: 'simple-enum', enum: KbCategory })
  category: KbCategory;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 'Article' })
  tag: string;

  /**
   * Optional external hyperlink (e.g. Confluence). Rendered as a plain
   * <a>/window.open navigation from Angular, not a fetch/XHR call — same
   * category as any other outbound link in the UI, not an API integration.
   */
  @Column({ nullable: true })
  externalUrl: string | null;

  @Column({ default: 0 })
  viewCount: number;
}
