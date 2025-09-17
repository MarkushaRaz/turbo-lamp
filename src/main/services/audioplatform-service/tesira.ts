import { asError } from '_shared/utils';
import log from 'electron-log';
import net from 'node:net';

const logger = log.scope('AudioTesira');

const CALL_RESPONSE_TIMEOUT = 1000;

export class Tesira {
  private host: string;

  private port: number;

  private socket: net.Socket | null = null;

  private static instances: Map<string, Tesira> = new Map();

  private constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.connect();
    Tesira.instances.set(`${host}:${port}`, this);
    logger.debug(`created new tesira instance (${host}:${port})`);
  }

  public static getTesira = (host: string, port: number): Tesira => {
    const endpoint = `${host}:${port}`;
    logger.debug(`requested instance with endpoint ${endpoint}`);
    const instance = Tesira.instances.get(endpoint);
    logger.debug(instance ? 'instance is found and will be reused' : 'instance is not found and will be created');
    return instance ?? new Tesira(host, port);
  };

  private connect = () => {
    logger.debug(`connecting to ${this.host}:${this.port}`);
    const handler = (data: Buffer) => {
      if (data.length > 2 && data[0] === 0xff && data[1] === 0xfd) {
        logger.debug(`received telnet option ${data[2].toString(16)}`);
        this.socket?.write(Uint8Array.from([0xff, 0xfc, data[2]]));
      }
    };

    this.socket = net.createConnection(this.port, this.host);

    this.socket.addListener('data', handler);

    this.socket.prependOnceListener('close', () => {
      logger.debug(`disconnected from ${this.host}:${this.port}`);
      this.socket?.removeListener('data', handler);
      this.socket = null;
    });
  };

  private send = (command: string) => {
    if (!this.socket) this.connect();
    return this.socket?.write(`${command}\r\n`) ?? false;
  };

  private call = (command: string) => {
    if (!this.socket) this.connect();
    return new Promise<Buffer>((resolve, reject) => {
      this.socket?.write(`${command}\r\n`);
      this.socket?.prependOnceListener('data', resolve);
      this.socket?.prependOnceListener('error', reject);
      setTimeout(() => reject(asError('call response timed out')), CALL_RESPONSE_TIMEOUT);
    });
  };

  public recallPreset = async (index: number) => {
    if (index > 8999 || index < 1) throw new Error('Invalid preset index');
    const data = await this.call(`DEVICE recallPreset ${index + 1000}`);
    if (!data.length || data[0] !== '+'.charCodeAt(0)) throw new Error(`preset recall failed: ${data}`);
  };
}
