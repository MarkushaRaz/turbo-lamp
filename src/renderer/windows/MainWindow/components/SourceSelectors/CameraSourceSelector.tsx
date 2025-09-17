import React, { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VideoSourceIcon as EnabledIcon, NoVideoSourceIcon as DisabledIcon } from '_renderer/components';
import { SourceSelector, SourceSelectProps } from './SourceSelector';
import { DesktopAudioCaptureCheckbox } from './DesktopAudioCaptureCheckbox';

type Props = Pick<
  SourceSelectProps,
  | 'enabled'
  | 'mirrored'
  | 'onChangeSelectedSource'
  | 'onToggleDropdown'
  | 'onToggleSourceStatus'
  | 'selectedSource'
  | 'sourceEnabled'
  | 'sources'
> & {
  desktopAudioCaptureEnabled: boolean;
  onToggleDesktopAudioCaptureStatus?(): void;
  showDesktopAudioCaptureCheckbox?: boolean;
};

export const CameraSourceSelector: FunctionComponent<Props> = ({
  desktopAudioCaptureEnabled,
  mirrored,
  onToggleDesktopAudioCaptureStatus,
  selectedSource,
  showDesktopAudioCaptureCheckbox,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const constraints: MediaStreamConstraints = useMemo(
    () => ({
      audio: false,
      video: {
        deviceId: selectedSource?.deviceId ?? '',
        height: { ideal: 360 },
      },
    }),
    [selectedSource],
  );

  return (
    <SourceSelector
      constraints={constraints}
      dropdownText={t('window.main.cameraSourceSelector.dropdown.text')}
      enableVideoPreview
      mirrored={mirrored}
      removeDropdownBottomPadding={showDesktopAudioCaptureCheckbox}
      selectedSource={selectedSource}
      sourceDisabledIcon={DisabledIcon}
      sourceEnabledIcon={EnabledIcon}
      toggleTitle={t('window.main.cameraSourceSelector.toggle.title')}
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

CameraSourceSelector.defaultProps = {
  showDesktopAudioCaptureCheckbox: false,
  onToggleDesktopAudioCaptureStatus: undefined,
};
