import { PropsWithChildren as ReactPropsWithChildren, ReactNode } from 'react';

export type PropsWithChildren = ReactPropsWithChildren<Omit<ReactNode, 'ReactPortal'>>;
