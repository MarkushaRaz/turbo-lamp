/* eslint-disable promise/catch-or-return */
import { BridgeAPI } from '_/shared/services';
import { Teacher } from '_/shared/services/schedule-service/types';
import React, { ChangeEvent, Dispatch, FunctionComponent, SetStateAction } from 'react';
import { Button } from '@mui/material';
import { Grid } from '_renderer/components';
import { ConferenceWindowState } from '_/shared/types';
import log from 'electron-log';
import { asError } from '_shared/utils';
import {
  CameraEnabledCheckbox,
  MicrophoneEnabledCheckbox,
  SettingsAccordion,
  SettingsAccordionDetails,
  SettingsAccordionSummary,
} from '../../DashboardWindow/components';

import { ChangeCode } from '../components/ChangeCode';

const logger = log.scope('ConferenceWindow/Settings');

export interface Props {
  setAction: Dispatch<SetStateAction<ConferenceWindowState>>;
  teacher: Teacher;
}

export const Settings: FunctionComponent<Props> = ({ setAction, teacher }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [microphoneEnabled, setMicrophoneEnabled] = React.useState(false);
  const [cameraEnabled, setCameraEnabled] = React.useState(false);

  function handleSettingsChange(microphone: boolean, camera: boolean) {
    setCameraEnabled(camera);
    setMicrophoneEnabled(microphone);

    BridgeAPI.SetSettings(teacher.email, camera, microphone)
      .then((result) => {
        if (result === 1) {
          logger.info('Successfully saved meet settings on bridge');
          // Successfully saved
        } else {
          logger.warn('Cant save meet settings on bridge, saving error');
          // Saving error
        }
      })
      .catch((e) => {
        logger.error(asError(e).message, asError(e));
      });
  }

  const handleAccordingChange = (panel: string) => (_event: ChangeEvent<unknown>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() => {
    BridgeAPI.GetSettings(teacher.email)
      .then((result) => {
        logger.info('Get meet settings from bridge');
        setCameraEnabled(result.cameraEnabled);
        setMicrophoneEnabled(result.microphoneEnabled);
      })
      .catch((e) => {
        logger.error(asError(e).message, asError(e));
      });
  }, [teacher?.email]);

  return (
    <div style={{ height: '100vh', width: '100%', bottom: '15' }}>
      <div style={{ float: 'left', height: '50px', width: '100%', margin: '15px 15px 0 15px' }}>
        <Button
          sx={{ width: 100 }}
          variant='contained'
          color='primary'
          onClick={() => {
            setAction({ display: 'Main' });
          }}
        >
          Главная
        </Button>
      </div>
      <Grid container direction='column' item grow={1} scrollY padded>
        <SettingsAccordion expanded={expanded === 'mainSettings'} onChange={handleAccordingChange('mainSettings')}>
          <SettingsAccordionSummary aria-controls='mainSettings-content' id='mainSettings-header'>
            Общие настройки
          </SettingsAccordionSummary>
          <SettingsAccordionDetails>
            <MicrophoneEnabledCheckbox
              checked={microphoneEnabled}
              onValueChange={(value) => {
                handleSettingsChange(value, cameraEnabled);
              }}
            />
            <CameraEnabledCheckbox
              checked={cameraEnabled}
              onValueChange={(value) => {
                handleSettingsChange(microphoneEnabled, value);
              }}
            />
          </SettingsAccordionDetails>
        </SettingsAccordion>
        <SettingsAccordion
          expanded={expanded === 'securitySettings'}
          onChange={handleAccordingChange('securitySettings')}
        >
          <SettingsAccordionSummary aria-controls='securitySettings-content' id='securitySettings-header'>
            Настройка кода доступа
          </SettingsAccordionSummary>
          <SettingsAccordionDetails>
            <ChangeCode teacher={teacher} />
          </SettingsAccordionDetails>
        </SettingsAccordion>
      </Grid>
    </div>
  );
};
