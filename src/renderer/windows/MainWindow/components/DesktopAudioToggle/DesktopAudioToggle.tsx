import React, { FunctionComponent } from 'react';
import { makeStyles } from 'tss-react/mui';
import { VolumeOff as DisabledIcon, VolumeUp as EnabledIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AppRegion, AudioVolumeMeter } from '_renderer/components';
import { useWindowVisibility } from '_renderer/hooks';
import { Theme, Typography, lighten } from '@mui/material';
import { Property } from 'csstype';
import { CaptureSource } from '_/shared/types';

type Props = {
  enabled: boolean;
  sourceEnabled: boolean;
  selectedSource?: CaptureSource;
  onChange(enabled: boolean): void;
};

function statusToColor(sourceEnabled: boolean, hasSourceData: boolean, theme: Theme): Property.Color {
  const customColor = '#5B1E58';
  if (sourceEnabled && hasSourceData) return customColor;
  if (sourceEnabled && !hasSourceData) return theme.palette.error.dark;
  return lighten(customColor, 0.2);
}

const useStyles = makeStyles<Pick<Props, 'enabled' | 'selectedSource' | 'sourceEnabled'>>()(
  (theme, { enabled, selectedSource, sourceEnabled }) => ({
    root: {
      position: 'relative',
    },
    volumeMeter: {
      position: 'absolute',
      bottom: 32,
      right: 5,
    },
    container: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '85%',
      justifyContent: 'space-around',
      maxWidth: 60,
    },
    icon: {
      color: statusToColor(sourceEnabled, !!selectedSource, theme),
      cursor: enabled ? 'pointer' : 'default',
      fontSize: 48,
      marginBottom: -5,
      opacity: enabled ? 0.85 : 0.5,
      '&:hover': {
        opacity: enabled ? 1 : 0.5,
      },
    },
    captionContainer: {
      position: 'relative',
      marginTop: -2,
    },
    caption: {
      cursor: enabled ? 'pointer' : 'default',
      display: 'inline-block',
      lineHeight: 1.1,
      minHeight: 24,
      position: 'relative',
      textAlign: 'center',
    },
  }),
);

export const DesktopAudioToggle: FunctionComponent<Props> = ({
  sourceEnabled,
  selectedSource,
  enabled,
  onChange,
}: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles({
    enabled,
    selectedSource,
    sourceEnabled,
  });
  const isWindowVisible = useWindowVisibility();
  const showMeter = isWindowVisible && sourceEnabled && selectedSource?.deviceId;
  const Icon = sourceEnabled ? EnabledIcon : DisabledIcon;

  const handleClick = () => {
    if (!enabled) return;
    onChange(!sourceEnabled);
  };

  const iconTitle = enabled
    ? t('window.main.desktopAudioToggle.tooltip.text')
    : t('window.main.desktopAudioToggle.tooltip.disabled');

  return (
    <div className={classes.root}>
      <AppRegion>
        <div className={classes.container}>
          <div title={iconTitle}>
            <Icon className={classes.icon} onClick={handleClick} />
          </div>
          <div className={classes.captionContainer}>
            <Typography variant='caption' className={classes.caption} onClick={handleClick}>
              {t('window.main.desktopAudioToggle.title')}
            </Typography>
          </div>
        </div>
      </AppRegion>
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

DesktopAudioToggle.defaultProps = {
  selectedSource: undefined,
};
