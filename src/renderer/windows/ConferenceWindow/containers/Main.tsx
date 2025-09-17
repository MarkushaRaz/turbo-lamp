/* eslint-disable jsx-a11y/label-has-associated-control */
import { ConferenceWindowState } from '_/shared/types';
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'react-i18next';
import log from 'electron-log';

const logger = log.scope('ConferenceWindow/Main');

export interface Props {
  setAction: Dispatch<SetStateAction<ConferenceWindowState>>;
}

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '500px',
    height: '240px',
    margin: '150px 145px',
    alignContent: 'space-between',
  },
  tile: {
    float: 'left',
    cursor: 'pointer',
    margin: '10px 5px 10px 5px',
    width: '240px',
    height: '100px',
    border: '1px solid gray',
  },
  tileSVG: {
    float: 'left',
    width: '36px',
    height: '36px',
    margin: '32px 12px 32px 12px',
  },
  tileLabel: {
    float: 'left',
    cursor: 'pointer',
    marginTop: '35px',
    fontSize: '24px',
    textAlign: 'center',
  },
}));

export const Main: FunctionComponent<Props> = ({ setAction }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  function openConference() {
    logger.info('Open conference');
    setAction({ display: 'EventPreconfigure', mode: '1' });
  }

  function openBroadcast() {
    logger.info('Open broadcast');
    setAction({ display: 'EventPreconfigure', mode: '2' });
  }

  function openHistory() {
    logger.info('Open meet history');
    setAction({ display: 'History' });
  }

  function openSettings() {
    logger.info('Open meet settings');
    setAction({ display: 'Settings' });
  }

  return (
    <div className={classes.root}>
      <div onClick={() => openConference()} className={classes.tile}>
        <svg viewBox='0 0 24 24' className={classes.tileSVG}>
          <path
            fill='black'
            d='M20 4C21.1 4 22 4.89 22 6V16C22 17.11 21.11 18 20 18H24V20H0V18H4C2.9 18 2 17.11 2 16V6C2 4.89 2.89 4 4 4H20M20 6H4V16H20V6M12 12C14.21 12 16 12.9 16 14V15H8V14C8 12.9 9.79 12 12 12M12 7C13.11 7 14 7.9 14 9S13.11 11 12 11 10 10.11 10 9 10.9 7 12 7Z'
          />
        </svg>
        <label className={classes.tileLabel}>{t('general.conference')}</label>
      </div>
      <div onClick={() => openBroadcast()} className={classes.tile}>
        <svg viewBox='0 0 24 24' className={classes.tileSVG}>
          <path d='M12 10C10.9 10 10 10.9 10 12S10.9 14 12 14 14 13.1 14 12 13.1 10 12 10M18 12C18 8.7 15.3 6 12 6S6 8.7 6 12C6 14.2 7.2 16.1 9 17.2L10 15.5C8.8 14.8 8 13.5 8 12.1C8 9.9 9.8 8.1 12 8.1S16 9.9 16 12.1C16 13.6 15.2 14.9 14 15.5L15 17.2C16.8 16.2 18 14.2 18 12M12 2C6.5 2 2 6.5 2 12C2 15.7 4 18.9 7 20.6L8 18.9C5.6 17.5 4 14.9 4 12C4 7.6 7.6 4 12 4S20 7.6 20 12C20 15 18.4 17.5 16 18.9L17 20.6C20 18.9 22 15.7 22 12C22 6.5 17.5 2 12 2Z' />
        </svg>
        <label className={classes.tileLabel}>{t('general.broadcast')}</label>
      </div>
      <div onClick={() => openHistory()} className={classes.tile}>
        <svg viewBox='0 0 24 24' className={classes.tileSVG}>
          <path
            d='M3 5.67541V3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3V7C1 8.10457 1.89543 9 3 9H7C7.55229 9 8 8.55229 8 8C8 7.44772 7.55229 7 7 7H4.52186C4.54218 6.97505 4.56157 6.94914 4.57995 6.92229C5.621 5.40094 7.11009 4.22911 8.85191 3.57803C10.9074 2.80968 13.173 2.8196 15.2217 3.6059C17.2704 4.3922 18.9608 5.90061 19.9745 7.8469C20.9881 9.79319 21.2549 12.043 20.7247 14.1724C20.1945 16.3018 18.9039 18.1638 17.0959 19.4075C15.288 20.6513 13.0876 21.1909 10.9094 20.9247C8.73119 20.6586 6.72551 19.605 5.27028 17.9625C4.03713 16.5706 3.27139 14.8374 3.06527 13.0055C3.00352 12.4566 2.55674 12.0079 2.00446 12.0084C1.45217 12.0088 0.995668 12.4579 1.04626 13.0078C1.25994 15.3309 2.2082 17.5356 3.76666 19.2946C5.54703 21.3041 8.00084 22.5931 10.6657 22.9188C13.3306 23.2444 16.0226 22.5842 18.2345 21.0626C20.4464 19.541 22.0254 17.263 22.6741 14.6578C23.3228 12.0526 22.9963 9.30013 21.7562 6.91897C20.5161 4.53782 18.448 2.69239 15.9415 1.73041C13.4351 0.768419 10.6633 0.756291 8.14853 1.69631C6.06062 2.47676 4.26953 3.86881 3 5.67541Z'
            fill='#0F0F0F'
          />
          <path
            d='M12 5C11.4477 5 11 5.44771 11 6V12.4667C11 12.4667 11 12.7274 11.1267 12.9235C11.2115 13.0898 11.3437 13.2344 11.5174 13.3346L16.1372 16.0019C16.6155 16.278 17.2271 16.1141 17.5032 15.6358C17.7793 15.1575 17.6155 14.546 17.1372 14.2698L13 11.8812V6C13 5.44772 12.5523 5 12 5Z'
            fill='#0F0F0F'
          />
        </svg>
        <label className={classes.tileLabel}>{t('general.history')}</label>
      </div>
      <div onClick={() => openSettings()} className={classes.tile}>
        <svg viewBox='0 0 24 24' className={classes.tileSVG}>
          <path
            fill='black'
            d='M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z'
          />
        </svg>
        <label className={classes.tileLabel}>{t('window.dashboard.settings.drawerTitle')}</label>
      </div>
    </div>
  );
};
