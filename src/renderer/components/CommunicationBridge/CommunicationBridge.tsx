/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/require-default-props */
import { ipcRenderer } from 'electron';
import log from 'electron-log';
import jws from 'jws';
import moment from 'moment';
import React, { FunctionComponent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ScreenSharingDialog } from '_/renderer/components/ScreenSharingDialog';
import { makeSelectSettingsState } from '_/shared/selectors';
import { Teacher } from '_/shared/services/schedule-service/types';
import { CombinedState, SettingsState } from '_/shared/types';
import { asError } from '_shared/utils';
import { setAktruMeetBroadcastingAction } from '_/shared/actions';
import { recordingWindowStateSelector } from '../../windows/RecordingWindow/state';

const logger = log.scope('CommunicationBridge');

interface Props {
  planned: boolean;
  mode: string;
  eventID: string;
  eventName?: string;
  broadcastsServer?: string;
  broadcastsKey?: string;
  teacher: Teacher;
  presenceControl: boolean;
}

interface Selection {
  settings: SettingsState;
}

const stateSelector = createStructuredSelector<CombinedState, Selection>({
  settings: makeSelectSettingsState(),
});

export const CommunicationBridge: FunctionComponent<Props> = ({
  planned,
  mode,
  eventID,
  eventName,
  broadcastsServer,
  broadcastsKey,
  teacher,
  presenceControl,
}: Props) => {
  const [screenSharingDialogOpen, setScreenSharingDialogOpen] = useState(false);
  const { audioCaptureSource, cameraCaptureSource, desktopCaptureSource } = useSelector(recordingWindowStateSelector);
  const { settings } = useSelector(stateSelector);
  const dispatch = useDispatch();
  const [meet, setMeet] = useState({});

  const shareScreenSharingDialog = useRef((sourceId: string, sourceType: string, screenShareAudio: boolean) => {});
  const closeScreenSharingDialog = useRef(() => {});

  const loadScripts = () => {
    let resolveLoadScriptsPromise: any = null;
    const loadScriptsPromise = new Promise((resolve) => {
      resolveLoadScriptsPromise = resolve;
    });

    const script = document.createElement('script');
    script.src = `${settings.communicationBridgeUrl}/external_api.js`;
    script.async = true;
    script.onload = () => resolveLoadScriptsPromise(true);
    document.body.appendChild(script);
    return loadScriptsPromise;
  };

  const initialization = async () => {
    if (!(window as any).AktruMeetExternalAPI) {
      await loadScripts();
    }

    const presenceControlEnabled = planned ? settings.presenceControlEnabled : presenceControl;
    const token = jws.sign({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: {
        Name: eventName,
        Mode: mode,
        Channel: eventID,
        Moderation: true,
        PresenceControl: presenceControlEnabled,
        Creation: moment().local().subtract(1, 'minute').unix(),
        Ending: moment().local().add(2, 'hour').unix(),
        UserProfile: {
          LastName: teacher.name,
          Email: teacher.email,
        },
        CommunicationSettings: {
          StartWithAudioMuted: settings.communicationMicrophoneEnabled !== true,
          StartWithVideoMuted: settings.communicationCameraEnabled !== true,
          AutostartBroadcasts: settings.autostartBroadcastsEnabled,
          MainSource: desktopCaptureSource,
          SecondSource: cameraCaptureSource,
          MicrophoneSource: audioCaptureSource,
          BroadcastsServer: broadcastsServer,
          BroadcastsKey: broadcastsKey,
        },
      },
      secret: 'Aktru01032022',
    });

    let domain = '';

    try {
      domain = new URL(settings.communicationBridgeUrl).hostname;
    } catch (e) {
      logger.error(`Invalid Bridge URL: ${asError(e).message}`, asError(e));
    }

    const options = {
      parentNode: document.getElementById('meet'),
      jwt: token,
      onload: reinstantiateScreenSharing,
    };

    function recordCommunicationLog(message: string) {
      logger.info(message);
      if (message.includes('Start broadcast')) {
        dispatch(setAktruMeetBroadcastingAction(true));
      } else if (message.includes('Stop broadcast')) {
        dispatch(setAktruMeetBroadcastingAction(false));
      }
    }

    const api = new (window as any).AktruMeetExternalAPI(domain, options);
    function reinstantiateScreenSharing() {
      const iframe = api.getIFrame();
      iframe.ClientVersion = '2';
      iframe.contentWindow.AktruMeetScreenObtainer = {
        openDesktopPicker(
          options: any,
          onSourceChoose: (sourceId: string, sourceType: string, screenShareAudio: boolean) => void,
        ): void {
          setScreenSharingDialogOpen(true);

          shareScreenSharingDialog.current = (sourceId: string, sourceType: string, screenShareAudio: boolean) => {
            onSourceChoose(sourceId, sourceType, screenShareAudio);
            setScreenSharingDialogOpen(false);
          };

          closeScreenSharingDialog.current = () => {
            onSourceChoose('', '', false);
            setScreenSharingDialogOpen(false);
          };
        },
      };

      iframe.contentWindow.AktruCommunicationLog = recordCommunicationLog;

      switch (mode) {
        case '1':
          iframe.contentWindow.closing = () => {
            ipcRenderer.send('changing-display', 'Close');
          };
          break;
        case '2':
          iframe.contentWindow.closing = () => {
            iframe.contentWindow.stopBroadcast();
            ipcRenderer.send('changing-display', 'Close');
          };
          break;
        default:
          iframe.contentWindow.endSessionElectron = () => {
            ipcRenderer.send('changing-display', 'Close');
          };
          break;
      }
      setMeet(api);
    }
  };

  React.useEffect(() => {
    initialization();
    return () => (meet as any)?.dispose?.();
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div id='meet' style={{ width: '100%', height: '100vh' }} />
      {screenSharingDialogOpen && (
        <ScreenSharingDialog
          onClose={closeScreenSharingDialog.current}
          toShare={shareScreenSharingDialog.current}
          open={screenSharingDialogOpen}
        />
      )}
    </div>
  );
};
