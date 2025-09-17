import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ClassNameMap } from '@mui/material';
import { Close as CloseIcon, Minimize as MinimizeIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AppRegion } from '_renderer/components/AppRegion';

type WindowControlsClassKey = 'root' | 'control' | 'minimizeIcon' | 'closeIcon';

type Size = 'small' | 'inherit' | 'normal' | 'medium' | 'large' | number;

export interface WindowControlsProps {
  classes?: Partial<ClassNameMap<WindowControlsClassKey>>;
  docked?: boolean;
  onCloseClick?: () => void;
  onMinimizeClick?: () => void;
  showCloseControl?: boolean;
  showMinimizeControl?: boolean;
  size?: Size;
}

type StyleProp = Pick<WindowControlsProps, 'size' | 'docked'>;

const sizeToFontSize = (size?: Size) => {
  if (typeof size === 'number') return size;

  switch (size) {
    case 'small':
      return '20px';
    case 'normal':
      return '24px';
    case 'medium':
      return '28px';
    case 'large':
      return '35px';
    default:
      return 'inherit';
  }
};

const useStyles = makeStyles<StyleProp>()((theme, { docked, size }) => ({
  root: {
    display: 'flex',
    lineHeight: 0,
    position: docked ? 'static' : 'absolute',
    right: 0,
    top: 0,
  },
  control: {
    color: theme.palette.grey['600'],
    cursor: 'pointer',
    fontSize: sizeToFontSize(size),
    transition: 'all 200ms ease-out',
    '&:hover': {
      color: theme.palette.grey['900'],
    },
  },
  minimizeIcon: {
    transform: 'translateY(-30%)',
  },
}));

export const WindowControls: FunctionComponent<WindowControlsProps> = ({
  classes: classesFromProps,
  docked,
  onCloseClick,
  onMinimizeClick,
  showCloseControl,
  showMinimizeControl,
  size,
}: WindowControlsProps) => {
  const { classes, cx } = useStyles({ size, docked });
  const { t } = useTranslation();

  return (
    <AppRegion className={cx(classes.root, classesFromProps?.root)}>
      {showMinimizeControl && (
        <div title={t<string>('window.general.minimize')}>
          <MinimizeIcon
            className={cx(
              classes.control,
              classes.minimizeIcon,
              classesFromProps?.control,
              classesFromProps?.closeIcon,
            )}
            onClick={onMinimizeClick}
          />
        </div>
      )}
      {showCloseControl && (
        <div title={t<string>('window.general.close')}>
          <CloseIcon
            className={cx(classes.control, classesFromProps?.control, classesFromProps?.closeIcon)}
            onClick={onCloseClick}
          />
        </div>
      )}
    </AppRegion>
  );
};

WindowControls.defaultProps = {
  classes: undefined,
  docked: false,
  onCloseClick: undefined,
  onMinimizeClick: undefined,
  showCloseControl: true,
  showMinimizeControl: true,
  size: 'normal',
};
