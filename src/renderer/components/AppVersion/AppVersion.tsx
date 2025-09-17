import React, { ElementType, FunctionComponent, HTMLAttributes } from 'react';
import { createStructuredSelector } from 'reselect';
import { CombinedState } from '_shared/types';
import { makeSelectAppVersion } from '_shared/selectors';
import { useSelector } from 'react-redux';

interface Props extends HTMLAttributes<HTMLElement> {
  className?: string;
  component?: ElementType | undefined;
}

interface Selection {
  version: string;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  version: makeSelectAppVersion(),
});

export const AppVersion: FunctionComponent<Props> = ({ className, component, ...htmlAttributes }: Props) => {
  const { version } = useSelector(stateSelector);
  if (!component) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{version}</>;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const Component = component!;
  return (
    <Component className={className} {...htmlAttributes}>
      {version}
    </Component>
  );
};

AppVersion.defaultProps = {
  className: '',
  component: undefined,
};
