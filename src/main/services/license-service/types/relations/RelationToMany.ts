import { ResourceData } from '../common/ResourceData';

export interface RelationToMany<T> {
  data: Array<ResourceData<T>>;
}
