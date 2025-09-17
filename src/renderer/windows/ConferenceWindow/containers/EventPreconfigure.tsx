import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import { PresenceControlCheckbox } from '../../DashboardWindow/components';
import { EventNameField } from '../components/EventNameField';
import { ConferenceWindowState } from '../../../../shared/types';
import { BridgeAPI } from '../../../../shared/services';

export interface Props {
  teacher: string | undefined;
  mode: string;
  setAction: Dispatch<SetStateAction<ConferenceWindowState>>;
}

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
    height: '240px',
    margin: '150px 145px',
    alignContent: 'space-between',
  },
  input: {
    width: '500px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
  },
}));

export const EventPreconfigure: FunctionComponent<Props> = ({ teacher, mode, setAction }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [eventName, setEventName] = useState('');
  const [presenceControlEnabled, setPresenceControlEnabled] = useState(false);

  function Begin() {
    if (teacher) {
      BridgeAPI.AddEvent(teacher, eventName)
        .then((eventID: any) => {
          setAction({ display: 'Communication', mode, eventID, presenceControl: presenceControlEnabled });
        })
        .catch(() => {});
    }
  }

  function Cansel() {
    setAction({ display: 'Main' });
  }

  return (
    <div className={classes.root}>
      <EventNameField className={classes.input} value={eventName} onValueChange={(value) => setEventName(value)} />
      <PresenceControlCheckbox
        checked={presenceControlEnabled}
        onValueChange={(value) => setPresenceControlEnabled(value)}
      />
      <div className={classes.grid}>
        <Button
          sx={{ width: 200, margin: '10px 0px 10px 10px' }}
          variant='contained'
          color='success'
          onClick={() => {
            Begin();
          }}
        >
          {t('communication.button.begin')}
        </Button>
        <Button
          sx={{ width: 200, margin: '10px 0px 10px 10px' }}
          variant='contained'
          color='error'
          onClick={() => {
            Cansel();
          }}
        >
          {t('communication.button.cansel')}
        </Button>
      </div>
    </div>
  );
};
