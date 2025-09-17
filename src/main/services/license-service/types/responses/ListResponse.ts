import { Meta, ResourceData } from '../common';

export interface ListResponse<T> {
  data: Array<ResourceData<T>>;
  meta: Meta;
}
