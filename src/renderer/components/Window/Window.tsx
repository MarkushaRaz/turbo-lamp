import React, { ElementType, Fragment, FunctionComponent, ReactNode } from 'react';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import { CombinedState } from '_shared/types';
import { makeSelectWindowTitle } from '_shared/selectors';
import { WindowTitleBarProps } from './WindowTitleBar';
import { WindowFrame, WindowFrameProps } from './WindowFrame';
import { WindowControls, WindowControlsProps } from './WindowControls';

interface Props {
  children?: ReactNode;
  className?: string;
  controlsProps?: Omit<WindowControlsProps, 'docked'>;
  customControlsComponent?: ElementType;
  customFrameComponent?: ElementType;
  customTitleBarComponent?: ElementType;
  frameless?: boolean;
  frameProps?: Omit<
    WindowFrameProps,
    'controlsProps' | 'showControls' | 'showStatusBar' | 'showTitleBar' | 'statusBar' | 'titleBarProps' | 'title'
  >;
  showControls?: boolean;
  showStatusBar?: boolean;
  showTitleBar?: boolean;
  statusBar?: ElementType;
  titleBarProps?: Omit<WindowTitleBarProps, 'borderRadius' | 'controlsProps' | 'showControls' | 'title'>;
}

type StylesProps = Pick<Props, 'frameless'>;

const useStyles = makeStyles<StylesProps>()((theme, { frameless }) => ({
  root: {
    height: '100vh',
    width: '100vw',
    padding: theme.spacing(frameless ? 0 : 1),
  },
}));

interface Selection {
  title: string;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  title: makeSelectWindowTitle(),
});

export const Window: FunctionComponent<Props> = ({
  children,
  className,
  controlsProps,
  customControlsComponent,
  customFrameComponent,
  customTitleBarComponent,
  frameless,
  frameProps,
  showControls,
  showStatusBar,
  showTitleBar,
  statusBar,
  titleBarProps,
}: Props) => {
  const { classes, cx } = useStyles({ frameless });
  const Frame = frameless ? Fragment : customFrameComponent ?? WindowFrame;
  const Controls = customControlsComponent ?? WindowControls;
  const { title } = useSelector(stateSelector);

  return (
    <div className={cx(classes.root, className)}>
      <Frame
        {...(!frameless &&
          !customFrameComponent && {
            ...frameProps,
            controlsProps,
            customControlsComponent,
            customTitleBarComponent,
            showControls,
            showStatusBar,
            showTitleBar,
            statusBar,
            title,
            titleBarProps,
          })}
      >
        {children}
        {showControls && (frameless || !showTitleBar || customFrameComponent) && (
          <Controls {...(!customControlsComponent && controlsProps)} />
        )}
      </Frame>
    </div>
  );
};

Window.defaultProps = {
  children: undefined,
  className: '',
  controlsProps: undefined,
  customControlsComponent: undefined,
  customFrameComponent: undefined,
  customTitleBarComponent: undefined,
  frameless: false,
  frameProps: {},
  showControls: false,
  showStatusBar: false,
  showTitleBar: false,
  statusBar: undefined,
  titleBarProps: undefined,
};
