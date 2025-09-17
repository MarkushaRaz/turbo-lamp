import React, { ElementType, FunctionComponent, ReactNode, useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ClassNameMap } from '@mui/material';
import { WindowControlsProps } from './WindowControls';
import { WindowTitleBar, WindowTitleBarProps } from './WindowTitleBar';
import { WindowFrameContext } from './WindowFrameContext';
import { FRAME_BORDER_RADIUS } from './constants';

type WindowFrameClassKey = 'root' | 'titleBar' | 'content' | 'statusBar';

export interface WindowFrameProps {
  borderRadius?: number;
  children?: ReactNode;
  classes?: Partial<ClassNameMap<WindowFrameClassKey>>;
  controlsProps?: Omit<WindowControlsProps, 'docked'>;
  customControlsComponent?: ElementType;
  customTitleBarComponent?: ElementType;
  showStatusBar?: boolean;
  showControls?: boolean;
  showTitle?: boolean;
  showTitleBar?: boolean;
  statusBar?: ElementType;
  title?: string;
  titleBarProps?: Omit<WindowTitleBarProps, 'borderRadius' | 'title'>;
}

type StyleProps = Pick<WindowFrameProps, 'borderRadius' | 'showStatusBar' | 'showTitleBar'>;

const useStyles = makeStyles<StyleProps>()((theme, { borderRadius, showStatusBar, showTitleBar }) => ({
  root: {
    background: 'rgba(248,248,255,0.97)',
    borderColor: theme.palette.grey['400'],
    borderRadius,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: '0 0 8px 0 rgba(0, 0, 0, 0.3)',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
    borderBottomLeftRadius: showStatusBar ? 0 : borderRadius,
    borderBottomRightRadius: showStatusBar ? 0 : borderRadius,
    borderTopLeftRadius: showTitleBar ? 0 : borderRadius,
    borderTopRightRadius: showTitleBar ? 0 : borderRadius,
  },
  statusBar: {
    background: 'rgba(40, 40, 40, 0.05)',
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    borderTop: `1px solid ${theme.palette.grey['300']}`,
    flexBasis: theme.spacing(3),
  },
}));

export const WindowFrame: FunctionComponent<WindowFrameProps> = ({
  borderRadius,
  classes: classesFromProps,
  children,
  showControls,
  controlsProps,
  customControlsComponent,
  customTitleBarComponent,
  showStatusBar,
  showTitle,
  showTitleBar,
  statusBar: StatusBar,
  title,
  titleBarProps,
}: WindowFrameProps) => {
  const { classes, cx } = useStyles({ borderRadius, showStatusBar, showTitleBar });
  const TitleBarComponent = customTitleBarComponent ?? WindowTitleBar;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const memoizedContextValue = useMemo(() => ({ borderRadius: borderRadius! }), [borderRadius]);

  return (
    <WindowFrameContext.Provider value={memoizedContextValue}>
      <div className={cx(classes.root, classesFromProps?.root)}>
        {showTitleBar && (
          <div className={classesFromProps?.titleBar}>
            <TitleBarComponent
              {...(!customTitleBarComponent && {
                ...titleBarProps,
                borderRadius,
                controlsProps,
                customControlsComponent,
                showControls,
                showTitle,
                title,
              })}
            />
          </div>
        )}
        <div className={cx(classes.content, classesFromProps?.content)}>{children}</div>
        {showStatusBar && (
          <div className={cx(classes.statusBar, classesFromProps?.statusBar)}>{StatusBar && <StatusBar />}</div>
        )}
      </div>
    </WindowFrameContext.Provider>
  );
};

WindowFrame.defaultProps = {
  borderRadius: FRAME_BORDER_RADIUS,
  children: undefined,
  classes: undefined,
  controlsProps: undefined,
  customControlsComponent: undefined,
  customTitleBarComponent: undefined,
  showStatusBar: true,
  showControls: true,
  showTitle: true,
  showTitleBar: true,
  statusBar: undefined,
  title: '',
  titleBarProps: undefined,
};
