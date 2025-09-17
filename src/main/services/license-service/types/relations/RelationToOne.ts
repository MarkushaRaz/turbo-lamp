import { ResourceData } from '../common/ResourceData';

export interface RelationToOne<T> {
  data: ResourceData<T> | null;
}
