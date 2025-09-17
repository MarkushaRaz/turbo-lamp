import { WebSocket } from 'ws';
import detectPort from 'detect-port';
import log from 'electron-log';
import { asError } from '_shared/utils';
import {
  SDRecorderFunctions,
  SDRecorderRecordingStates,
  SDRecorderErrorCodes,
  StreamDeckMessage,
  StreamDeckServerConfig,
  StreamDeckServerState,
  SDRecorderInterfaceStates,
} from './types';

const logger = log.scope('StreamDeckService');

type StreamDeckServerEventListeners = { [key: string]: (obj: StreamDeckMessage) => object };

export class StreamDeckServer {
  public readonly audioMaxPreset: number;

  public readonly cameraMaxPreset: number;

  public currentState: Partial<StreamDeckServerState>;

  private readonly config: StreamDeckServerConfig;

  private client: WebSocket | null;

  private readonly eventListeners: StreamDeckServerEventListeners;

  constructor(config: StreamDeckServerConfig = { ports: [9000] }) {
    logger.info('Initialize streamdeck server');
    this.config = config;
    this.cameraMaxPreset = config.cameraMaxPreset || 1;
    this.audioMaxPreset = config.audioMaxPreset || 1;
    this.client = null;
    this.eventListeners = {};

    this.currentState = config.initialState || {
      recording: SDRecorderRecordingStates.IDLE,
      cameraPreset: 1,
      interface: SDRecorderInterfaceStates.NORMAL,
    };

    if (!this.config.ports.length) {
      logger.error('No ports specified for StreamDeck server');
      return;
    }

    config.ports.forEach((port) => {
      detectPort(port, (_error, availablePort) => {
        if (port === availablePort) {
          const wsServer = new WebSocket.Server({ port });
          wsServer.on('connection', this.onConnect);
          // TODO: should also provide a handler for the "on-error" event
        } else {
          logger.error(`Cannot create WebSocket server for StreamDeck on port ${port}`);
        }
      });
    });

    this.on(SDRecorderFunctions.GET_CURRENT_STATE, this.onGetState);
  }

  private static defaultHandler = () => {
    return {
      code: SDRecorderErrorCodes.ERR_INVALID_FUNCTION,
      message: 'Unknown function',
    };
  };

  private onGetState = () => {
    return {
      code: SDRecorderErrorCodes.OK,
      message: 'OK',
      data: this.currentState,
    };
  };

  private async onMessage(wsClient: WebSocket, message: string) {
    logger.info(message);
    // TODO: Malformed JSON will throw when parsed
    const obj = JSON.parse(message) as StreamDeckMessage;
    const event = obj.event || '';

    const handler = this.eventListeners[event];
    let answer = {};
    try {
      answer = handler ? await handler(obj) : StreamDeckServer.defaultHandler();
    } catch (error) {
      answer = {
        code: SDRecorderErrorCodes.ERR_UNKNOWN,
        message: 'Unknown error',
      };
    }

    const strAnswer = JSON.stringify(answer);
    try {
      wsClient.send(strAnswer);
    } catch (error) {
      logger.error(asError(error).message, asError(error));
    }
    logger.debug(strAnswer);
  }

  private onDisconnect = () => {
    this.client = null;
    logger.info('StreamDeck disconnected');
  };

  private onConnect = async (wsClient: WebSocket) => {
    if (this.client) {
      this.client.close();
    }
    this.client = wsClient;
    logger.info('StreamDeck connected');
    wsClient.on('message', (message: string) => this.onMessage(wsClient, message));
    wsClient.on('close', this.onDisconnect);
  };

  public notifyStateChanged = () => {
    const event = JSON.stringify({
      event: SDRecorderFunctions.NOTIFY_STATE_CHANGED,
    });
    if (this.client) {
      logger.debug(event);
      this.client.send(event);
    }
  };

  public on(event: string, callback: (obj: StreamDeckMessage) => object) {
    this.eventListeners[event] = callback;
  }
}
