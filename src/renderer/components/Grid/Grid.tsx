import React, { FunctionComponent, ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ClassNameMap } from '@mui/material';
import { Property } from 'csstype';

type ClassKey = 'root' | 'container' | 'item' | 'paper';

interface Props {
  alignContent?: Property.AlignContent;
  alignItems?: Property.AlignItems;
  alignSelf?: Property.AlignSelf;
  basis?: Property.FlexBasis | number;
  children?: ReactNode;
  className?: string;
  classes?: Partial<ClassNameMap<ClassKey>>;
  container?: boolean;
  direction?: Property.FlexDirection;
  fillHeight?: boolean;
  grow?: Property.FlexGrow;
  height?: Property.Height;
  item?: boolean;
  justifyContent?: Property.JustifyContent;
  order?: Property.Order;
  padded?: boolean;
  padding?: number;
  paper?: boolean;
  scroll?: boolean;
  scrollX?: boolean;
  scrollY?: boolean;
  shrink?: Property.FlexShrink;
  width?: Property.Width;
  wrap?: Property.FlexWrap;
}

type StyleProps = Omit<Props, 'children' | 'className' | 'container' | 'item' | 'paper'>;

const useStyles = makeStyles<StyleProps>()(
  (
    theme,
    {
      alignContent,
      alignItems,
      alignSelf,
      basis,
      direction,
      fillHeight,
      grow,
      height,
      justifyContent,
      order,
      padded,
      padding,
      scroll,
      scrollX,
      scrollY,
      shrink,
      width,
      wrap,
    },
  ) => ({
    root: {
      height: fillHeight ? '100%' : height || 'auto',
      overflowX: scroll || scrollX ? 'auto' : 'hidden',
      overflowY: scroll || scrollY ? 'auto' : 'hidden',
      padding: theme.spacing(padding || (padded ? 2 : 0)),
      width,
    },
    container: {
      display: 'flex',
      alignContent,
      alignItems,
      flexDirection: direction ?? 'row',
      flexWrap: wrap,
      justifyContent: justifyContent ?? 'unset',
    },
    item: {
      alignSelf,
      flexBasis: basis,
      flexGrow: grow,
      flexShrink: shrink,
      order: order ?? 0,
    },
    paper: {
      background: 'white',
    },
  }),
);

export const Grid: FunctionComponent<Props> = (props: Props) => {
  const { children, className, classes: classesFromProps, container, item, paper, ...styleProps } = props;
  const { classes, cx } = useStyles(styleProps);

  return (
    <div
      className={cx(
        classes.root,
        className,
        classesFromProps?.root,
        container && [classes.container, classesFromProps?.container],
        item && [classes.item, classesFromProps?.item],
        paper && [classes.paper, classesFromProps?.paper],
      )}
    >
      {children}
    </div>
  );
};

Grid.defaultProps = {
  alignContent: 'normal',
  alignItems: 'stretch',
  alignSelf: 'auto',
  basis: 'auto',
  children: undefined,
  className: '',
  classes: undefined,
  container: false,
  direction: 'row',
  fillHeight: false,
  grow: 0,
  height: 'auto',
  item: false,
  justifyContent: 'flex-start',
  order: 0,
  padded: false,
  padding: 0,
  paper: false,
  scroll: false,
  scrollX: false,
  scrollY: false,
  shrink: 1,
  width: 'auto',
  wrap: 'nowrap',
};
