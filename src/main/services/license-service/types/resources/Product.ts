import { DateAttributes } from '../common';
import { RelationToMany } from '../relations';
import { Platform } from './Platform';

export interface Product extends DateAttributes {
  name: string;
  uuid: string;
  description: string | null;
  url: string | null;
  distributionStrategy: 'CLOSED' | 'LICENSED' | 'OPEN';
  metadata: unknown | null;
  platforms: RelationToMany<Platform>;
}
