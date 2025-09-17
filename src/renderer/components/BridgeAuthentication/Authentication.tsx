import { makeStyles } from 'tss-react/mui';
import { BridgeAPI } from '_/shared/services';
import { Teacher } from '_/shared/services/schedule-service/types';
import { ConferenceWindowState } from '_/shared/types';
import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react';
import { PinInput } from 'react-input-pin-code';
import { useTranslation } from 'react-i18next';
import { i18n } from '_/renderer/localization';

interface Props {
  setAction: Dispatch<SetStateAction<ConferenceWindowState>>;
  teacher: Teacher;
}

const useStyles = makeStyles()(() => ({
  view: {
    width: '432px',
    height: '20%',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
  },
  title: {
    margin: '5px auto',
    textAlign: 'center',
  },
  pinInputBox: {
    width: '210px',
    margin: 'auto',
  },
  error: {
    margin: '5px auto',
    color: 'red',
    textAlign: 'center',
  },
}));

export const Authentication: FunctionComponent<Props> = ({ setAction, teacher }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const [pinValues, setPinValues] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const handlePinChange = (_value: string | string[], index: number, values: string[]) => {
    setPinValues(values);

    if (index === 0) {
      setError('');
    }

    if (index === 3) {
      BridgeAPI.Authenticate(teacher.email, values.join(''))
        .then((result) => {
          if (result === 1) {
            // TODO: use router
            setAction({ display: 'Communication', eventID: '' });
          } else {
            setError(`${i18n.t<string>('communication.errors.invalidAccessCode')}`);
          }
        })
        .catch(() => {
          setError(`${i18n.t<string>('communication.errors.authorizationError')}`);
        });
    }
  };

  return (
    <div>
      <div className={classes.view}>
        <h1 className={classes.title}>{t('communication.authentication.title')}</h1>
        <div className={classes.pinInputBox}>
          <PinInput
            mask
            autoFocus
            focusBorderColor='#0d6efd'
            errorBorderColor='rgb(255, 0, 0)'
            size='lg'
            values={pinValues}
            onChange={handlePinChange}
          />
        </div>
        <h4 className={classes.error}>{error}</h4>
      </div>
    </div>
  );
};
