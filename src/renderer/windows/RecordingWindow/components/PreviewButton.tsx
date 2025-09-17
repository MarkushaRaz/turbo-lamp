import React, { FunctionComponent } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { ButtonControl, RecordControlProps } from './ButtonControl';

type Props = Pick<RecordControlProps, 'onClick' | 'enabled'> & {
  previewEnabled: boolean;
};

export const PreviewButton: FunctionComponent<Props> = ({ enabled, previewEnabled, onClick }: Props) => {
  const { t } = useTranslation();
  const icon = previewEnabled ? VisibilityIcon : VisibilityOffIcon;

  return (
    <ButtonControl
      Icon={icon}
      enabled={enabled}
      onClick={onClick}
      title={t('window.recording.previewButton.title')}
      width='medium'
    />
  );
};
