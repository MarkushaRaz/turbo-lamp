/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable promise/catch-or-return */
import log from 'electron-log';
import { BridgeAPI } from '_/shared/services';
import { Teacher } from '_/shared/services/schedule-service/types';
import { asError } from '_shared/utils';
import React, { FunctionComponent } from 'react';
import { PinInput } from 'react-input-pin-code';

const logger = log.scope('ConferenceWindow/ChangeCode ');

export interface Props {
  teacher: Teacher;
}

export const ChangeCode: FunctionComponent<Props> = ({ teacher }) => {
  const [stage, setStage] = React.useState(0);
  const [values, setValues] = React.useState(['', '', '', '']);
  const [code, setCode] = React.useState(['', '', '', '']);
  const [replaceCode, setReplaceCode] = React.useState(['', '', '', '']);
  const [error, setError] = React.useState('');

  switch (stage) {
    case 0:
      return (
        <div style={{ width: '430px', margin: '112px auto' }}>
          <h1 style={{ margin: '5px auto', textAlign: 'center' }}>Введите код доступа</h1>
          <div style={{ width: '210px', margin: 'auto' }}>
            <PinInput
              mask
              autoFocus
              focusBorderColor='#0d6efd'
              validBorderColor='rgb(255, 0, 0)'
              size='lg'
              values={values}
              onChange={(_value, index, values) => {
                setValues(values);
                if (index === 0) {
                  setError('');
                }
                if (index === 3) {
                  logger.info(`Trying to authenticate ${teacher.email}`);
                  BridgeAPI.Authenticate(teacher.email, values.join(''))
                    .then((result) => {
                      if (result === 1) {
                        logger.info('Authenticate successfully');
                        setValues(['', '', '', '']);
                        setStage(1);
                      } else {
                        logger.info('Authenticate failed');
                        setError('Неверный код доступа');
                      }
                    })
                    .catch((e) => {
                      logger.error(asError(e).message, asError(e));
                      setError('Ошибка авторизации');
                    });
                }
              }}
            />
          </div>
          <h4 style={{ margin: '5px auto', textAlign: 'center', color: 'red' }}>{error}</h4>
        </div>
      );
      break;
    case 1:
      return (
        <div>
          <div style={{ width: '432px', margin: '10px auto' }}>
            <h2 style={{ margin: '5px auto', textAlign: 'center' }}>Новый код</h2>
            <div style={{ width: '210px', margin: 'auto' }}>
              <PinInput
                mask
                autoFocus
                focusBorderColor='#0d6efd'
                size='lg'
                values={code}
                onChange={(_value, _index, code) => {
                  setCode(code);
                }}
              />
            </div>
          </div>
          <div style={{ width: '432px', margin: '10px auto' }}>
            <h2 style={{ margin: '5px auto', textAlign: 'center' }}>Повторите код</h2>
            <div style={{ width: '210px', margin: 'auto' }}>
              <PinInput
                mask
                focusBorderColor='#0d6efd'
                size='lg'
                values={replaceCode}
                onChange={(_value, index, replaceCode) => {
                  setReplaceCode(replaceCode);
                  if (index === 0) {
                    setError('');
                  }
                  if (index === 3) {
                    BridgeAPI.ChangeCode(teacher.email, replaceCode.join(''))
                      .then((result) => {
                        if (result === 1) {
                          setCode(['', '', '', '']);
                          setReplaceCode(['', '', '', '']);
                          setStage(0);
                        } else {
                          setCode(['', '', '', '']);
                          setReplaceCode(['', '', '', '']);
                          setError('Введенные коды не совпадают');
                        }
                      })
                      .catch(() => {
                        setError('Ошибка авторизации');
                      });
                  }
                }}
              />
            </div>
            <h4 style={{ margin: '5px auto', textAlign: 'center', color: 'red' }}>{error}</h4>
          </div>
        </div>
      );
      break;
    default:
      return <div />;
      break;
  }
};
