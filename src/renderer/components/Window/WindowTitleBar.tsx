import React, { ElementType, FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ClassNameMap } from '@mui/material';
import { AppRegion } from '_renderer/components/AppRegion';
import { AktruIcon } from '_renderer/components/AktruIcon';
import { WindowControls, WindowControlsProps } from './WindowControls';

type WindowTitleBarClassKey = 'controls' | 'icon' | 'root' | 'title';

export interface WindowTitleBarProps {
  borderRadius?: number;
  classes?: Partial<ClassNameMap<WindowTitleBarClassKey>>;
  controlsProps?: Omit<WindowControlsProps, 'docked'>;
  customControlsComponent?: ElementType;
  drag?: boolean;
  icon?: ElementType;
  height?: number;
  showControls?: boolean;
  showIcon?: boolean;
  showTitle?: boolean;
  title?: string;
}

type StyleProps = Pick<WindowTitleBarProps, 'borderRadius' | 'height' | 'showIcon'>;

const useStyles = makeStyles<StyleProps>()((theme, { borderRadius, height: size, showIcon }) => ({
  root: {
    background: 'rgba(40, 40, 40, 0.05)',
    borderBottom: `1px solid ${theme.palette.grey['300']}`,
    borderTopRightRadius: borderRadius,
    borderTopLeftRadius: borderRadius,
    display: 'flex',
    alignItems: 'center',
    height: size,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: size,
    width: size,
  },
  title: {
    color: theme.palette.grey['900'],
    fontSize: 18,
    flexGrow: 1,
    paddingLeft: showIcon ? theme.spacing(0.5) : theme.spacing(2),
    textAlign: 'center',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingRight: theme.spacing(0.6),
  },
}));

export const WindowTitleBar: FunctionComponent<WindowTitleBarProps> = ({
  borderRadius,
  classes: classesFromProps,
  showControls,
  controlsProps,
  customControlsComponent,
  drag,
  icon: CustomIconComponent,
  height,
  title,
  showIcon,
  showTitle,
}: WindowTitleBarProps) => {
  const { classes, cx } = useStyles({ borderRadius, height, showIcon });
  const ControlsComponent = customControlsComponent ?? WindowControls;

  return (
    <AppRegion drag={drag} className={cx(classes.root, classesFromProps?.root)}>
      {showIcon && (
        <div className={cx(classes.icon, classesFromProps?.icon)}>
          {CustomIconComponent ? <CustomIconComponent /> : <AktruIcon size={height} />}
        </div>
      )}
      <div className={cx(classes.title, classesFromProps?.title)}>{showTitle && title}</div>
      {showControls && (
        <div className={cx(classes.controls, classesFromProps?.controls)}>
          <ControlsComponent
            {...(!customControlsComponent && {
              ...controlsProps,
              size: controlsProps?.size ?? 'medium',
              docked: true,
            })}
          />
        </div>
      )}
    </AppRegion>
  );
};

WindowTitleBar.defaultProps = {
  borderRadius: 0,
  classes: undefined,
  controlsProps: undefined,
  customControlsComponent: undefined,
  drag: true,
  icon: undefined,
  height: 44,
  showControls: true,
  showIcon: true,
  showTitle: true,
  title: '',
};
