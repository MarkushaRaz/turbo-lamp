import { ElementType } from 'react';

export interface DrawerItem {
  route: string;
  text: string;
  icon: ElementType;
  hasError?: boolean;
}
