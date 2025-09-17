import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { MicOffRounded as DisabledIcon, MicRounded as EnabledIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AudioVolumeMeter } from '_renderer/components';
import { useWindowVisibility } from '_renderer/hooks';
import { SourceSelector, SourceSelectProps } from './SourceSelector';

type Props = Pick<
  SourceSelectProps,
  | 'enabled'
  | 'sourceEnabled'
  | 'onChangeSelectedSource'
  | 'onToggleDropdown'
  | 'onToggleSourceStatus'
  | 'selectedSource'
  | 'sources'
>;

const useStyles = makeStyles()(() => ({
  root: {
    position: 'relative',
  },
  volumeMeter: {
    position: 'absolute',
    bottom: 32,
    right: 0,
  },
}));

export const AudioSourceSelector: FunctionComponent<Props> = ({ sourceEnabled, selectedSource, ...props }: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const isWindowVisible = useWindowVisibility();
  const showMeter = isWindowVisible && sourceEnabled && selectedSource?.deviceId;

  return (
    <div className={classes.root}>
      <SourceSelector
        dropdownText={t('window.main.audioSourceSelector.dropdown.text')}
        enableVideoPreview={false}
        selectedSource={selectedSource}
        sourceEnabled={sourceEnabled}
        sourceDisabledIcon={DisabledIcon}
        sourceEnabledIcon={EnabledIcon}
        toggleTitle={t('window.main.audioSourceSelector.toggle.title')}
        {...props}
      />
      {showMeter && (
        <AudioVolumeMeter
          className={classes.volumeMeter}
          orientation='vertical'
          width={5}
          audioDeviceId={selectedSource?.deviceId}
          height={38}
          borderRadius={3}
        />
      )}
    </div>
  );
};
