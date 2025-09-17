import { ipcRenderer } from 'electron';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Authentication, CommunicationBridge } from '_/renderer/components';
import { makeSelectSettingsState } from '_/shared/selectors';
import { Lecture } from '_/shared/services/schedule-service/types';
import { CombinedState, ConferenceWindowState, SettingsState } from '_/shared/types';
import log from 'electron-log';

const logger = log.scope('CommunicationWindow');

const defaultAction: ConferenceWindowState = { display: 'Start', eventID: '' };
interface Selection {
  settings: SettingsState;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  settings: makeSelectSettingsState(),
});

export const CommunicationWindow: FunctionComponent = () => {
  const [action, setAction] = useState(defaultAction);
  const { settings } = useSelector(stateSelector);
  const [lecture, setLecture] = useState<Lecture>();

  // TODO: Use redux to set the initial state before window is loaded
  ipcRenderer.on('store-data', (_event, store: Lecture) => {
    if (store === undefined) return;
    setLecture(store);
  });

  // TODO: Duplicates ConferenceWindow.
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    logger.info(`Pressed ${event.key}`);
    if (event.ctrlKey && ['q', 'й'].includes(event.key)) {
      setAction({ display: 'Authentication', eventID: '' });
    }
  }, []);

  // TODO Custom hooks: "Are we a joke to you lot"?
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  if (lecture !== undefined) {
    // TODO: Um... use router?
    if (action.display === 'Start') {
      if (settings.communicationAuthenticationEnabled) {
        action.display = 'Authentication';
      } else {
        action.display = 'ScheduledCommunication';
      }
    }

    ipcRenderer.send('changing-display', action.display);
    switch (action.display) {
      case 'Authentication':
        return <Authentication setAction={setAction} teacher={lecture.teacher} />;
      case 'Communication':
      case 'ScheduledCommunication':
        return (
          // TODO: Mode, broadcast Server, broadcast Key can also be added to the schedule service,
          // you can add logic if there is a server and an RTMP key in the schedule
          <CommunicationBridge
            planned
            mode={settings.bridgeMode.valueOf().toString()}
            eventID={lecture.uid}
            eventName={lecture.title}
            broadcastsServer={settings.broadcastsServer}
            broadcastsKey={settings.broadcastsKey}
            teacher={lecture.teacher}
            presenceControl={false}
          />
        );
      case 'Exit':
        // TODO: Move this to main?
        window.close();
        return null;
      default:
        throw new Error('Unknown display mode detected in CommunicationWindow');
    }
  } else {
    return null;
  }
};
