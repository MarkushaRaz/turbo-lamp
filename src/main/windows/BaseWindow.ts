import { BrowserWindow, Menu, Event } from 'electron';
import { enable as enableRemote } from '@electron/remote/main';
import windowStateKeeper, { State } from 'electron-window-state';
import log from 'electron-log';
import _ from 'lodash';
import { DEFAULT_WINDOW_ICON } from '_main/constants';
import { WindowPosition } from '_main/enums';
import { WindowProperties } from '_main/types';
import { getAssetPath, positionToCoords, resolveWindowUrl } from '_main/utils';
import { IS_DEV, IS_PROD } from '_shared/constants';

const logger = log.scope('BaseWindow');

export class BaseWindow {
  public readonly className = this.constructor.name;

  protected browserWindow?: BrowserWindow;

  private defaultProperties: Omit<WindowProperties, 'route'> = {
    show: false,
    icon: getAssetPath(DEFAULT_WINDOW_ICON),
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: IS_PROD,
    },
  };

  private canClose = false;

  private readonly properties: WindowProperties;

  private readonly windowState: State;

  constructor(properties: WindowProperties) {
    this.windowState = windowStateKeeper({
      defaultHeight: properties.height,
      defaultWidth: properties.width,
      file: this.className,
    });

    const stateWithDefaults = _.defaults(
      properties.resizable ? this.windowState : _.omit(this.windowState, ['height', 'width']),
      properties,
    );

    this.properties = properties.keepState ? stateWithDefaults : properties;
  }

  public init(hidden = false) {
    return new Promise<void>((resolve, reject) => {
      logger.debug(`Initialize ${this.className} window`);
      this.browserWindow = new BrowserWindow({
        ...this.defaultProperties,
        ...this.properties,
        paintWhenInitiallyHidden: !hidden,
      });

      enableRemote(this.browserWindow.webContents);

      this.browserWindow.setMenu(null);
      this.initDevContextMenu();

      if (this.properties.keepState) {
        this.windowState.manage(this.browserWindow);
      }

      if (this.properties.x && this.properties.y) {
        logger.debug(`Set window postiont to: ${this.properties.x}x${this.properties.y}`);
        this.browserWindow.setPosition(this.properties.x, this.properties.y);
      } else if (this.properties.position) {
        logger.debug(`Set window postiont to: ${this.properties.position}`);
        this.setPosition(this.properties.position);
      }

      this.browserWindow.on('closed', () => {
        this.browserWindow = undefined;
      });

      this.browserWindow.on('close', (event) => {
        this.onClose(event);
      });

      this.browserWindow.webContents.on('did-finish-load', () => {
        if (!hidden) {
          this.show();
        }
        resolve();
      });

      const handleError = (e: Error) => {
        logger.error(e.message, e);
        this.browserWindow?.close();
        reject(e);
      };

      this.browserWindow.webContents.on('preload-error', (_event, _preloadPath, error) => handleError(error));

      this.browserWindow.webContents.on('did-fail-load', (_event, _errorCode, errorDescription) => {
        handleError(new Error(errorDescription));
      });

      this.browserWindow.loadURL(resolveWindowUrl(this.properties.route)).catch((e) => {
        handleError(e);
      });
    });
  }

  public bringToFront() {
    logger.debug(`Bring window ${this.className} to front`);
    if (!this.browserWindow?.isAlwaysOnTop()) {
      this.browserWindow?.setAlwaysOnTop(true);
    }

    setTimeout(() => {
      this.browserWindow?.setAlwaysOnTop(false);
    }, 500);
  }

  public show() {
    logger.debug(`Show ${this.className} window`);
    if (!this.browserWindow?.isVisible()) {
      this.browserWindow?.show();
    }

    if (!this.browserWindow?.isFocused()) {
      this.browserWindow?.focus();
    }

    this.bringToFront();
  }

  public hide() {
    logger.debug(`Hide ${this.className} window`);
    if (this.browserWindow?.isMinimized()) {
      this.browserWindow?.restore();
    }
    this.browserWindow?.hide();
  }

  public changeIcon(iconName: string) {
    logger.debug(`Set icon to ${iconName}`);
    this.browserWindow?.setIcon(getAssetPath(iconName));
  }

  public minimize() {
    logger.debug(`Minimize ${this.className} window`);
    this.browserWindow?.minimize();
  }

  public closeWindow() {
    logger.debug(`Close ${this.className} window`);
    this.browserWindow?.close();
  }

  public onClose(event: Event) {
    if (this.canClose) {
      return;
    }

    event.preventDefault();
    this.hide();
  }

  public getBrowserWindow(): BrowserWindow | undefined {
    logger.debug(`Get browser window: ${this.browserWindow?.title}`);
    return this.browserWindow;
  }

  public isVisible() {
    logger.debug(`Is browser window visible: ${this.browserWindow?.isVisible()}`);
    return this.browserWindow?.isVisible() || false;
  }

  public isMinimized() {
    logger.debug(`Is browser window minimized: ${this.browserWindow?.isMinimized()}`);
    return this.browserWindow?.isMinimized() || false;
  }

  public setCanClose(canClose: boolean) {
    logger.debug(`Is browser window can be closed: ${canClose}`);
    this.canClose = canClose;
  }

  public setPosition(position: WindowPosition) {
    logger.debug(`Set ${this.className} window position`);
    if (!this.browserWindow) return;
    const coords = positionToCoords(this.browserWindow.getBounds(), position);
    this.browserWindow.setPosition(coords.x, coords.y);
  }

  private initDevContextMenu() {
    if (!IS_DEV) return;

    logger.debug(`Initialize dev context menu`);
    this.browserWindow?.webContents.on('context-menu', (_event, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.browserWindow?.webContents.inspectElement(x, y);
          },
        },
        { role: 'reload' },
        { role: 'toggleDevTools' },
      ]).popup({ window: this.browserWindow });
    });
  }
}
