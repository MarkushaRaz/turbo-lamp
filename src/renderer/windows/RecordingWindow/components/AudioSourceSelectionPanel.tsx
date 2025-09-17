import React, { FunctionComponent, useContext, useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';
import { WindowFrameContext } from '_/renderer/components/Window';
import { CaptureSource, CombinedState } from '_/shared/types';
import { AudioVolumeMeter } from '_/renderer/components';
import { useDispatch, useSelector } from 'react-redux';
import { makeSelectAudioCaptureSources } from '_/shared/selectors';
import { createStructuredSelector } from 'reselect';
import { getAvailableAudioCaptureSourcesAction } from '_/shared/actions';
import { SourceSelector } from './SourceSelector';

interface Props {
  onChangeSelectedSource: (source: CaptureSource) => void;
  selectedSource: CaptureSource | undefined;
  roundTopCorners?: boolean;
}

type StyleProps = {
  borderRadius: number;
};

const useStyles = makeStyles<StyleProps>()((theme, { borderRadius }) => ({
  root: {
    borderTop: `1px solid ${theme.palette.grey['300']}`,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    padding: '0px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  meter: {
    margin: '5px auto',
  },
}));

interface Selection {
  audioCaptureSources: CaptureSource[];
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  audioCaptureSources: makeSelectAudioCaptureSources(),
});

export const AudioSourceSelectionPanel: FunctionComponent<Props> = ({
  onChangeSelectedSource,
  roundTopCorners,
  selectedSource,
}: Props) => {
  let { borderRadius } = useContext(WindowFrameContext);
  if (!roundTopCorners) borderRadius = 0;
  const { classes } = useStyles({ borderRadius });
  const { audioCaptureSources } = useSelector(stateSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = () => {
      dispatch(getAvailableAudioCaptureSourcesAction(selectedSource));
    };
    navigator.mediaDevices.addEventListener('devicechange', handler);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handler);
    };
  }, [dispatch, selectedSource]);

  return (
    <div className={classes.root}>
      <AudioVolumeMeter
        audioDeviceId={selectedSource?.deviceId ?? ''}
        height={15}
        orientation='horizontal'
        width='90%'
        className={classes.meter}
      />
      <SourceSelector
        onChangeSelectedSource={onChangeSelectedSource}
        sources={audioCaptureSources}
        selectedSource={selectedSource}
      />
    </div>
  );
};

AudioSourceSelectionPanel.defaultProps = {
  roundTopCorners: undefined,
};
