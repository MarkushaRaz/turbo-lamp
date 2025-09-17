import React, { FunctionComponent, useMemo } from 'react';
import {
  DesktopAccessDisabledOutlined as DisabledIcon,
  DesktopWindowsOutlined as EnabledIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DesktopCaptureConstraints } from '_shared/types';
import { SourceSelector, SourceSelectProps } from './SourceSelector';
import { DesktopAudioCaptureCheckbox } from './DesktopAudioCaptureCheckbox';

type Props = Pick<
  SourceSelectProps,
  | 'enabled'
  | 'sourceEnabled'
  | 'onChangeSelectedSource'
  | 'onToggleDropdown'
  | 'onToggleSourceStatus'
  | 'selectedSource'
  | 'sources'
> & {
  desktopAudioCaptureEnabled: boolean;
  onToggleDesktopAudioCaptureStatus?(): void;
  showDesktopAudioCaptureCheckbox?: boolean;
};

export const DesktopSourceSelector: FunctionComponent<Props> = ({
  desktopAudioCaptureEnabled,
  onToggleDesktopAudioCaptureStatus,
  selectedSource,
  showDesktopAudioCaptureCheckbox,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const constraints: DesktopCaptureConstraints = useMemo(
    () => ({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: selectedSource?.deviceId ?? '',
        },
      },
    }),
    [selectedSource],
  );

  return (
    <SourceSelector
      constraints={constraints}
      dropdownText={t('window.main.desktopSourceSelector.dropdown.text')}
      enableVideoPreview
      removeDropdownBottomPadding={showDesktopAudioCaptureCheckbox}
      selectedSource={selectedSource}
      sourceDisabledIcon={DisabledIcon}
      sourceEnabledIcon={EnabledIcon}
      toggleTitle={t('window.main.desktopSourceSelector.toggle.title')}
      {...props}
    >
      {showDesktopAudioCaptureCheckbox && (
        <DesktopAudioCaptureCheckbox
          desktopAudioCaptureEnabled={desktopAudioCaptureEnabled}
          onToggleDesktopAudioCaptureStatus={onToggleDesktopAudioCaptureStatus}
        />
      )}
    </SourceSelector>
  );
};

DesktopSourceSelector.defaultProps = {
  onToggleDesktopAudioCaptureStatus: undefined,
  showDesktopAudioCaptureCheckbox: true,
};
