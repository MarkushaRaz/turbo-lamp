import { ipcRenderer } from 'electron';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Authentication, CommunicationBridge } from '_/renderer/components';
import { makeSelectSettingsState } from '_/shared/selectors';
import { Teacher } from '_/shared/services/schedule-service/types';
import { CombinedState, ConferenceWindowState, SettingsState } from '_/shared/types';
import log from 'electron-log';
import { Authorization, EventPreconfigure, History, Main, Settings } from './containers';

const logger = log.scope('ConferenceWindow');

const defaultAction: ConferenceWindowState = { display: 'Authorization', eventID: '' };

interface Selection {
  settings: SettingsState;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  settings: makeSelectSettingsState(),
});

export const ConferenceWindow: FunctionComponent = () => {
  const [action, setAction] = useState(defaultAction);
  const { settings } = useSelector(stateSelector);
  const [teacher, setTeacher] = useState<Teacher>();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    logger.info(`Pressed ${event.key}`);
    if (event.ctrlKey && ['q', 'й'].includes(event.key)) {
      setAction(defaultAction);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (action.display === 'Communication') {
    if (teacher !== undefined) {
      if (action.mode && action.eventID) {
        action.display = 'Communication';
      } else {
        action.display = 'Main';
      }
    }
  }
  ipcRenderer.send('changing-display', action.display);

  // TODO: Use router
  switch (action.display) {
    case 'Authorization':
      return <Authorization setAction={setAction} setTeacher={setTeacher} />;
    case 'Authentication':
      if (teacher) {
        return <Authentication setAction={setAction} teacher={teacher} />;
      }
      return <Authorization setAction={setAction} setTeacher={setTeacher} />;
    case 'EventPreconfigure':
      if (teacher) {
        return (
          <EventPreconfigure
            setAction={setAction}
            mode={action.mode !== undefined ? action.mode : '0'}
            teacher={teacher.email}
          />
        );
      }
      return <Authorization setAction={setAction} setTeacher={setTeacher} />;
    case 'Communication':
      if (teacher !== undefined) {
        if (action.mode && action.eventID) {
          return (
            <CommunicationBridge
              planned={false}
              mode={action.mode}
              eventID={action.eventID}
              broadcastsServer={settings.broadcastsServer}
              broadcastsKey={settings.broadcastsKey}
              teacher={teacher}
              presenceControl={action.presenceControl !== undefined ? action.presenceControl : false}
            />
          );
        }
        return <Main setAction={setAction} />;
      }
      return <Authorization setAction={setAction} setTeacher={setTeacher} />;
    case 'Main':
      return <Main setAction={setAction} />;
    case 'History':
      if (teacher) {
        return <History setAction={setAction} teacher={teacher} />;
      }
      return <Main setAction={setAction} />;
    case 'Settings':
      if (teacher) {
        return <Settings setAction={setAction} teacher={teacher} />;
      }
      return <Main setAction={setAction} />;
    default:
      throw new Error('Unknown display mode detected in ConferenceWindow');
  }
};
