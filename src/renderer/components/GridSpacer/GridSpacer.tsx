import React, { FunctionComponent } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { Property } from 'csstype';

interface Props {
  allBorders?: boolean;
  backgroundColor?: Property.BackgroundColor;
  basis?: Property.FlexBasis | number;
  borderColor?: Property.BorderColor;
  borderStyle?: Property.BorderStyle;
  borderWidth?: Property.BorderWidth | number;
  bottomBorder?: boolean;
  className?: string;
  horizontalBorders?: boolean;
  leftBorder?: boolean;
  rightBorder?: boolean;
  topBorder?: boolean;
  transparent?: boolean;
  verticalBorders?: boolean;
}

type StyleProps = Omit<Props, 'className'>;

const useStyles = makeStyles<StyleProps>()(
  (
    theme: Theme,
    {
      allBorders,
      backgroundColor,
      basis,
      borderColor,
      borderStyle,
      borderWidth,
      bottomBorder,
      horizontalBorders,
      leftBorder,
      rightBorder,
      topBorder,
      transparent,
      verticalBorders,
    },
  ) => ({
    root: {
      background: transparent ? 'transparent' : backgroundColor || 'rgba(45, 45, 45, 0.05)',
      borderColor: borderColor || theme.palette.grey['300'],
      borderBottomStyle:
        allBorders || bottomBorder || horizontalBorders ? (borderStyle as Property.BorderBottomStyle) : 'none',
      borderLeftStyle: allBorders || leftBorder || verticalBorders ? (borderStyle as Property.BorderLeftStyle) : 'none',
      borderRightStyle:
        allBorders || rightBorder || verticalBorders ? (borderStyle as Property.BorderRightStyle) : 'none',
      borderTopStyle: allBorders || horizontalBorders || topBorder ? (borderStyle as Property.BorderTopStyle) : 'none',
      borderWidth,
      flexBasis: basis,
      flexShrink: 0,
    },
  }),
);

export const GridSpacer: FunctionComponent<Props> = (props: Props) => {
  const { className, ...styleProps } = props;
  const { classes, cx } = useStyles(styleProps);
  return <div className={cx(classes.root, className)} />;
};

GridSpacer.defaultProps = {
  allBorders: false,
  backgroundColor: undefined,
  basis: 5,
  borderColor: undefined,
  borderStyle: 'solid',
  borderWidth: 1,
  bottomBorder: false,
  className: '',
  horizontalBorders: false,
  leftBorder: false,
  rightBorder: false,
  topBorder: false,
  transparent: false,
  verticalBorders: false,
};
