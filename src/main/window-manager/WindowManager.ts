import { app, shell } from 'electron';
import log from 'electron-log';
import delay from 'delay';
import { BaseWindow, DashboardWindow, EntryWindow, MainWindow, RecordingWindow, SplashWindow } from '_main/windows';
import { WindowRoute } from '_shared/enums';
import { asError } from '_shared/utils';

const logger = log.scope('WindowManager');

export class WindowManager {
  private static instance: WindowManager;

  private currentWindow?: BaseWindow;

  private isBusy = false;

  private constructor() {
    app.on('window-all-closed', () => {
      this.currentWindow = undefined;
    });
  }

  public static getInstance = (): WindowManager => {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager();
    }

    return WindowManager.instance;
  };

  public getCurrentWindow = () => this.currentWindow;

  public static openExternal = (url: string) => {
    logger.info(`Open external url: ${url}`);
    shell.openExternal(url).catch((e) => {
      logger.error(asError(e).message, asError(e));
    });
  };

  public replaceCurrentWindow = <T extends BaseWindow>(WindowType: new () => T, hidden: boolean) =>
    new Promise<BaseWindow>((resolve, reject) => {
      logger.info(`Trying to replace current window by ${WindowType.name}`);
      if (!this.currentWindow || WindowType.name !== this.currentWindow?.className) {
        this.isBusy = true;

        if (this.currentWindow?.className !== SplashWindow.name) {
          logger.debug(`Hide current window ${this.currentWindow?.className}`);
          this.currentWindow?.hide();
        }

        logger.debug(`Initialize new window ${WindowType.name}`);
        const newWindow = new WindowType();
        newWindow
          .init(hidden)
          .then(() => {
            const webContents = newWindow.getBrowserWindow()?.webContents;

            webContents?.setWindowOpenHandler((details) => {
              WindowManager.openExternal(details.url);
              return { action: 'deny' };
            });
            this.currentWindow?.setCanClose(true);
            this.currentWindow?.closeWindow();
            this.currentWindow?.setCanClose(false);
            this.currentWindow = newWindow;

            logger.info(`New window initialized successfully ${WindowType.name}`);
            resolve(this.currentWindow);
          })
          .finally(() => {
            this.isBusy = false;
          })
          .catch(reject);
      } else {
        logger.debug('This window already initialized');
        this.currentWindow.show();
        resolve(this.currentWindow);
      }
    });

  public load = async (route: WindowRoute, hidden = false) => {
    logger.info(`Load ${route}`);

    while (this.isBusy) await delay(50);

    switch (route) {
      case WindowRoute.DashboardWindow:
        return this.replaceCurrentWindow(DashboardWindow, hidden);
      case WindowRoute.EntryWindow:
        return this.replaceCurrentWindow(EntryWindow, hidden);
      case WindowRoute.MainWindow:
        return this.replaceCurrentWindow(MainWindow, hidden);
      case WindowRoute.RecordingWindow:
        return this.replaceCurrentWindow(RecordingWindow, hidden);
      case WindowRoute.SplashWindow:
        return this.replaceCurrentWindow(SplashWindow, hidden);
      default:
        throw new Error('Unknown Window Type');
    }
  };

  public showCurrentOrOpenDefaultWindow = async () => {
    logger.debug('Try show current or open default window');
    if (this.currentWindow) {
      this.currentWindow.show();
    } else {
      await this.load(WindowRoute.MainWindow);
    }
  };
}
