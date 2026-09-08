import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { PortalEnvironment } from '../../common/enums';

/**
 * Standalone infrastructure/environment registry (division/plant/site/
 * cluster). Deliberately has no Team relation — division codes (PCG, PRF,
 * PDC, ...) don't map 1:1 to the ops team roster, per product decision.
 */
@Entity('portals')
export class Portal extends BaseEntity {
  @Column()
  division: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: 'N.A.' })
  plant: string;

  @Column({ default: '-' })
  sap: string;

  @Column()
  site: string;

  @Column()
  url: string;

  @Column({ default: '' })
  cluster: string;

  @Column({ default: '' })
  namespace: string;

  @Column({ type: 'simple-enum', enum: PortalEnvironment })
  environment: PortalEnvironment;
}
