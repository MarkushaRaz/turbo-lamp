import React, { ElementType, FunctionComponent, HTMLAttributes } from 'react';
import { makeStyles } from 'tss-react/mui';
import aktruIconMinSvg from './assets/icon-min.svg';
import aktruIconFullSvg from './assets/icon-full.svg';

interface Props extends HTMLAttributes<HTMLDivElement> {
  component?: ElementType;
  size?: string | number;
  variant?: 'full' | 'minimal';
}

const useStyles = makeStyles<Props>()((_, { size, variant }) => ({
  root: {
    height: size,
    width: size,
  },
  icon: {
    backgroundImage: `url(${variant === 'full' ? aktruIconFullSvg : aktruIconMinSvg})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
  },
}));

export const AktruIcon: FunctionComponent<Props> = ({
  className,
  component,
  size,
  variant,
  ...htmlAttributes
}: Props) => {
  const { classes, cx } = useStyles({ size, variant });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const Component = component!;

  return (
    <Component className={cx(classes.root, className)} {...htmlAttributes}>
      <div className={classes.icon} />
    </Component>
  );
};

AktruIcon.defaultProps = {
  component: 'span',
  size: 24,
  variant: 'minimal',
};
