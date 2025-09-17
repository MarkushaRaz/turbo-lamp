import React, { ButtonHTMLAttributes, ElementType, FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';

interface Props extends ButtonHTMLAttributes<HTMLElement> {
  component?: ElementType;
  drag?: boolean;
  userSelect?: boolean;
}

const useStyles = makeStyles<Props>()((_, { drag, userSelect }) => ({
  root: {
    userSelect: userSelect ? 'text' : 'none',
    WebkitAppRegion: drag ? 'drag' : 'no-drag',
  },
}));

export const AppRegion: FunctionComponent<Props> = ({
  children,
  className,
  component,
  drag,
  userSelect,
  ...htmlAttributes
}: Props) => {
  const { classes } = useStyles({ drag, userSelect });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const Component = component!;
  return (
    <Component className={`${classes.root} ${className}`} {...htmlAttributes}>
      {children}
    </Component>
  );
};

AppRegion.defaultProps = {
  component: 'div',
  drag: false,
  userSelect: false,
};
