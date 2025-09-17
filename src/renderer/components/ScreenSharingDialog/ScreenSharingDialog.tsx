/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Button, Dialog } from '@mui/material';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import log from 'electron-log';
import { ViewObject } from './ViewObject';

const logger = log.scope('ScreenShareDialog');

interface Props {
  onClose(): void;
  toShare(sourceId: string, sourceType: string, screenShareAudio: boolean): void;
  open: boolean;
}

interface VideoObject {
  id: string;
  name: string;
  stream: MediaStream;
}

const useStyles = makeStyles()(() => ({
  root: {
    background: 'rgba(24, 24, 24, 0.9)',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 99999,
    overflowY: 'initial',
  },
  view: {
    background: 'rgba(24, 24, 24, 1)',
    width: '600px',
    height: '545px',
    position: 'relative',
    padding: '5px 10px 5px 10px',
    borderRadius: '2.5px',
    borderColor: 'rgba(255, 255, 255, 0.75)',
    boxShadow: 'rgba(66, 153, 232, 1) 0px 0px 5px',
  },
  title: {
    marginLeft: '15px',
    color: 'white',
    fontSize: '18px',
  },
  tabs: {
    fontSize: 0,
    width: '550px',
    margin: 'auto',
    '& input[type="radio"]': {
      display: 'none',
    },
    '& label': {
      background: 'rgba(66, 153, 232, 1)',
      display: 'inline-block',
      width: '120px',
      textAlign: 'center',
      verticalAlign: 'middle',
      userSelect: 'none',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      padding: '2px 8px',
      fontSize: '16px',
      lineHeight: '1.5',
      transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out',
      cursor: 'pointer',
      position: 'relative',
      top: '1px',
    },
    '& input[type="radio"]:checked + label': {
      background: 'rgba(66, 153, 232, 0)',
      borderBottom: '1px solid #181818',
    },
    '& div': {
      display: 'none',
      height: '390px',
      border: 'rgba(255, 255, 255, 0.5) 1px solid',
      '& ul': {
        boxSizing: 'border-box',
        margin: '0',
        padding: '0',
        flexWrap: 'wrap',
        overflow: 'auto',
        height: 'calc(100%)',
        '& li': {
          float: 'left',
          margin: '10px 0px 0px 10px',
          width: '260px',
          height: '180px',
          cursor: 'pointer',
          '& video': {
            float: 'left',
            margin: '10px 0px 0px 10px',
            width: '240px',
            height: '140px',
          },
          '& label': {
            float: 'left',
            background: 'transparent',
            display: 'inline-block',
            margin: '5px 10px 0px 10px',
            width: '240px',
            height: '21px',
            color: 'white',
            fontSize: '14px',
            textAlign: 'center',
            border: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
      },
    },
  },
  actions: {
    marginLeft: '310px',
  },
  button_share: {
    float: 'left',
    background: 'rgba(66, 153, 232, 0.75)',
    margin: '15px 15px 10px 0px',
    width: '120px',
    height: '24px',
    color: 'white',
    fontSize: '15px',
    textAlign: 'center',
    border: 'rgba(255, 255, 255, 0.5) 1px solid',
    borderRadius: '0',
    boxShadow: '0px 0px 5px rgba(66, 153, 232, 0.25)',
    '&:disabled': {
      background: 'rgba(255, 255, 255, 0.25)',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    '&:hover': {
      background: 'rgba(66, 153, 232, 0.85)',
      border: 'rgba(255, 255, 255, 0.75) 1px solid',
      boxShadow: '0px 0px 5px rgba(66, 153, 232, 0.75)',
    },
  },
  button_close: {
    float: 'left',
    background: 'rgba(255, 255, 255, 0.25)',
    margin: '15px 15px 10px 0px',
    width: '120px',
    height: '24px',
    color: 'white',
    fontSize: '15px',
    textAlign: 'center',
    border: 'rgba(255, 255, 255, 0.5) 1px solid',
    borderRadius: '0',
    boxShadow: '0px 0px 5px rgba(66, 153, 232, 0.25)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.5)',
      border: 'rgba(255, 255, 255, 0.25) 1px solid',
      boxShadow: '0px 0px 5px rgba(66, 153, 232, 0.75)',
    },
  },
}));

export const ScreenSharingDialog: FunctionComponent<Props> = ({ onClose, toShare, open }: Props) => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const [activeTab, setActiveTab] = useState('screen');
  const [viewObjects, setViewObjects] = useState<VideoObject[]>([]);
  const [selected, setSelected] = useState<string>('');

  const selectedTab = (tab: string) => {
    logger.info(`Selected ${tab} tab`);
    setActiveTab(tab);
    setViewObjects([]);
    setSelected('');
    switch (tab) {
      case 'screen':
        ipcRenderer.send('getCaptureSource', tab);
        break;
      case 'window':
        ipcRenderer.send('getCaptureSource', tab);
        break;
      case 'camera':
        navigator.mediaDevices
          .enumerateDevices()
          .then(async (devices) => {
            devices.forEach((device) => {
              if (device.kind === 'videoinput') {
                navigator.mediaDevices
                  .getUserMedia({ audio: false, video: { deviceId: device.deviceId } })
                  .then((stream) => {
                    setViewObjects((prev) => [...prev, { id: device.deviceId, name: device.label, stream }]);
                  })
                  .catch((error) => {
                    throw new Error(error);
                  });
              }
            });
          })
          .catch(() => {
            throw new Error('Cameras are not detected.');
          });
        break;
      default:
        throw new Error('The object capture mode is unknown');
    }
  };

  useEffect(() => {
    selectedTab('screen');
    ipcRenderer.on('setCaptureSource', (_event, sources: Electron.DesktopCapturerSource[]) => {
      sources.forEach((source) => {
        navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                maxFrameRate: 5,
                maxWidth: 1920,
              },
            },
          })
          .then((stream) => {
            setViewObjects((prev) => [...prev, { id: source.id, name: source.name, stream }]);
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
    });
  }, []);

  return (
    <Dialog
      BackdropProps={{ classes: { root: classes.root } }}
      aria-describedby='screensharing-dialog-description'
      aria-labelledby='screensharing-dialog-title'
      onClose={onClose}
      open={open}
    >
      <div className={classes.view}>
        <p className={classes.title}>{t('communication.screenSharing.title')}</p>
        <div className={classes.tabs}>
          <input type='radio' id='screen' checked={activeTab === 'screen'} onChange={() => selectedTab('screen')} />
          <label htmlFor='screen'>{t('communication.screenSharing.tab.screen')}</label>
          <input type='radio' id='window' checked={activeTab === 'window'} onChange={() => selectedTab('window')} />
          <label htmlFor='window'>{t('communication.screenSharing.tab.window')}</label>
          <input type='radio' id='camera' checked={activeTab === 'camera'} onChange={() => selectedTab('camera')} />
          <label htmlFor='camera'>{t('general.camera')}</label>
          <div style={{ display: 'block' }}>
            <ul>
              {viewObjects.map((video: VideoObject) => (
                <ViewObject
                  key={video.id}
                  id={video.id}
                  name={video.name}
                  stream={video.stream}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.actions}>
          <Button
            onClick={() => toShare(selected, activeTab, false)}
            role='button'
            className={classes.button_share}
            disabled={selected === ''}
          >
            {t('communication.button.share')}
          </Button>
          <Button onClick={onClose} role='button' className={classes.button_close}>
            {t('general.cancel')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
