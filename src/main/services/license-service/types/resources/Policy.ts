import { RelationToMany, RelationToOne } from '../relations';
import { Product } from './Product';
import { Entitlement } from './Entitlement';

export interface Policy {
  name: string;
  uuid: string;
  metadata: unknown | null;
  createdAt: Date;
  updatedAt: Date;
  entitlements: RelationToMany<Entitlement>;
  product: RelationToOne<Product>;
}
