/* eslint-disable @typescript-eslint/no-shadow */
import { BrowserWindow, desktopCapturer, ipcMain, Menu, screen } from 'electron';
import { getAssetPath, resolveWindowUrl } from '_main/utils';
import { DEFAULT_WINDOW_ICON } from '_main/constants';
import { WindowProperties } from '_main/types';
import { WindowRoute } from '_shared/enums';
import * as remoteMain from '@electron/remote/main';
import { IS_DEV } from '_shared/constants';
import { Lecture } from '_shared/services/schedule-service/types';
import log from 'electron-log';
import { logWindowConsoleMessages } from '_main/services/log-service';

const logger = log.scope('CommunicationWindow');

const properties: WindowProperties = {
  width: 800,
  height: 600,
  route: WindowRoute.CommunicationWindow,
  icon: getAssetPath(DEFAULT_WINDOW_ICON),
  frame: true,
  transparent: false,
  resizable: false,
  minimizable: false,
  title: ' ',
  show: false,
  backgroundColor: '#FFF',
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,
  },
};

// TODO: See if we can extend the base window to avoid code duplication and maybe leverage the window manager
export class CommunicationWindow {
  private static currentWindow: BrowserWindow;

  private static initializedListeners = false;

  private static readyClose = true;

  public static isOpen = false;

  public static open(type: string, lecture?: Lecture) {
    logger.info('Open communication window');
    this.currentWindow = new BrowserWindow(properties);
    remoteMain.enable(this.currentWindow.webContents);
    this.currentWindow.setMenu(null);
    this.initDevContextMenu();

    logWindowConsoleMessages(this.currentWindow, 'CommunicationWindowConsole');

    this.currentWindow.on('closed', () => {
      logger.debug('Communication window closed');
      this.isOpen = false;
    });

    logger.debug(`Current window type is ${type}`);
    if (type === 'conference') {
      this.currentWindow.loadURL(resolveWindowUrl(WindowRoute.ConferenceWindow));
    } else {
      this.currentWindow.loadURL(resolveWindowUrl(WindowRoute.CommunicationWindow));
    }

    this.currentWindow.webContents.on('did-finish-load', () => {
      if (type === 'event') {
        this.currentWindow.webContents.send('store-data', lecture);
      }
      this.currentWindow.hide();
      this.currentWindow.show();
      this.currentWindow.setTitle(' ');
      this.isOpen = true;
    });

    this.currentWindow.on('close', (e) => {
      if (!this.readyClose) {
        e.preventDefault();
      }
    });

    this.currentWindow.on('closed', () => {
      this.isOpen = false;
    });

    if (!this.initializedListeners) {
      // TODO: Refactor this bit
      ipcMain.on('changing-display', (_event, arg: string) => {
        this.readyClose = true;
        logger.debug(`Change window display for ${arg}`);
        switch (arg) {
          case 'Authorization':
          case 'Authentication':
          case 'EventPreconfigure':
          case 'Main':
          case 'History':
          case 'Settings':
            this.WindowMode(0);
            break;
          case 'Conference':
          case 'Broadcast':
            this.WindowMode(1);
            break;
          case 'Communication':
            this.readyClose = false;
            this.WindowMode(1);
            break;
          case 'Close':
            this.currentWindow.close();
            break;
          case 'ScheduledCommunication':
            this.readyClose = false;
            this.WindowMode(1);
            this.currentWindow.minimize();
            break;
          case 'ToggleMinMaximize':
            if (this.currentWindow.isMinimized() && this.currentWindow.maximizable) {
              this.currentWindow.maximize();
            } else if (this.currentWindow.minimizable) {
              this.currentWindow.minimize();
            }
            break;
          default:
            throw new Error('Unknown display mode!');
        }
      });

      ipcMain.on('getCaptureSource', (_event, type: string) => {
        desktopCapturer
          .getSources({ types: [type] })
          .then(async (sources) => {
            logger.debug(`Get capture sources for meet`);
            this.currentWindow.webContents.send('setCaptureSource', sources);
          })
          .catch(() => {
            throw new Error('Capture objects are not detected.');
          });
      });
      this.initializedListeners = true;
    }
  }

  public static close() {
    this.currentWindow.close();
  }

  private static WindowMode(mode: number) {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    // TODO: Refactor this bit
    logger.debug(`Set window mode to ${mode}`);
    switch (mode) {
      case 0:
        this.currentWindow.unmaximize();
        this.currentWindow.setSize(800, 600);
        this.currentWindow.setPosition(width / 2 - 800 / 2, height / 2 - 600 / 2);
        this.currentWindow.minimizable = false;
        this.currentWindow.resizable = false;
        this.currentWindow.minimizable = false;
        break;
      case 1:
        this.currentWindow.minimizable = true;
        this.currentWindow.resizable = true;
        this.currentWindow.minimizable = true;
        this.currentWindow.maximize();
        break;
      case 2:
        this.currentWindow.setSize(480, 240);
        this.currentWindow.setPosition(width - 480, height - 240);
        this.currentWindow.resizable = false;
        break;
      default:
        throw new Error('Unknown display mode!');
    }
    logger.debug(
      `Window settings:
      ${this.currentWindow.getSize()}
      ${this.currentWindow.getPosition()}
      ${this.currentWindow.minimizable}
      ${this.currentWindow.maximizable}
      ${this.currentWindow.resizable}`,
    );
  }

  private static initDevContextMenu() {
    if (!IS_DEV) return;

    this.currentWindow?.webContents.on('context-menu', (_event, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.currentWindow?.webContents.inspectElement(x, y);
          },
        },
        { role: 'reload' },
        { role: 'toggleDevTools' },
      ]).popup({ window: this.currentWindow });
    });
  }
}
