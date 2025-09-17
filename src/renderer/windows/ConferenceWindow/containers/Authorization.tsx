/* eslint-disable promise/catch-or-return */
import { Teacher } from '_/shared/services/schedule-service/types';
import React, { Dispatch, FunctionComponent, SetStateAction, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Grid } from '_renderer/components';
import { ScheduleService } from '_/shared/services';
import { ConferenceWindowState } from '_/shared/types';
import { useTranslation } from 'react-i18next';
import log from 'electron-log';
import { UserSelect } from '../components';

const logger = log.scope('Authorization');

export interface Props {
  setAction: Dispatch<SetStateAction<ConferenceWindowState>>;
  setTeacher: Dispatch<SetStateAction<Teacher | undefined>>;
}

export const Authorization: FunctionComponent<Props> = ({ setAction, setTeacher }) => {
  const { t } = useTranslation();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>();
  const [teachers, setTeachers] = useState(new Array<Teacher>());

  useEffect(() => {
    logger.info('Get teachers list');
    ScheduleService.getTeachers().then((data: Teacher[]) => {
      setTeachers(data);
    });
  }, []);

  function Open() {
    if (selectedTeacher !== undefined) {
      logger.info(`Set ${selectedTeacher.email} as a teacher`);
      setTeacher(selectedTeacher);
      setAction({ display: 'Authentication' });
    }
  }

  return (
    <div>
      <div style={{ margin: '200px auto 0 auto', width: 300, textAlign: 'center' }}>
        <Grid container direction='column' item grow={1}>
          <UserSelect data={teachers} onValueChange={(value: Teacher) => setSelectedTeacher(value)} />
        </Grid>
      </div>
      <div style={{ margin: '0 auto', width: 300 }}>
        <Button
          sx={{ width: 300 }}
          variant='contained'
          color='success'
          onClick={() => {
            Open();
          }}
        >
          {t('communication.button.logIn')}
        </Button>
      </div>
    </div>
  );
};
