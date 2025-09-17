import log from 'electron-log';
import { ProcessEnvKey } from '_shared/enums';
import { removeTrailingSlashes } from '_shared/utils';

const logger = log.scope('BridgeAPI');

export class BridgeAPI {
  private static get bridgeUrl(): string {
    return removeTrailingSlashes(process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_URL] ?? '');
  }

  private static get bridgeToken(): string {
    logger.info(`Trying to get bridge token`);
    return process.env[ProcessEnvKey.COMMUNICATION_BRIDGE_TOKEN] ?? '';
  }

  public static async Authenticate(email: string, code: string) {
    logger.info(`Authenticate for ${email}`);
    const response = await fetch(
      `${this.getApiUrl()}User/Authentication?key=${this.bridgeToken}&email=${email}&code=${code}`,
    );
    return response.json();
  }

  public static async AddEvent(email: string, name: string) {
    logger.info(`Add event for ${email}`);
    const response = await fetch(`${this.getApiUrl()}Events/Add?key=${this.bridgeToken}&email=${email}&name=${name}`);
    return response.json();
  }

  public static async ChangeCode(email: string, code: string) {
    logger.info(`Change code for ${email}`);
    const response = await fetch(
      `${this.getApiUrl()}User/ChangeCode?key=${this.bridgeToken}&email=${email}&code=${code}`,
    );
    return response.json();
  }

  public static async GetSettings(email: string) {
    logger.info(`Get Settings for ${email}`);
    const response = await fetch(`${this.getApiUrl()}User/GetSettings?key=${this.bridgeToken}&email=${email}`);
    return response.json();
  }

  public static async GetEvents(email: string, page: number) {
    logger.info(`Get events for ${email}. Page: ${page}`);
    const response = await fetch(`${this.getApiUrl()}Events/List?key=${this.bridgeToken}&email=${email}&page=${page}`);
    return response.json();
  }

  public static async SetSettings(email: string, camera: boolean, microphone: boolean) {
    logger.info(`Set settings for ${email}`);
    const response = await fetch(
      `${this.getApiUrl()}User/SetSettings?key=${
        this.bridgeToken
      }&email=${email}&cameraEnabled=${camera}&microphoneEnabled=${microphone}`,
    );
    return response.json();
  }

  private static getApiUrl() {
    return `${this.bridgeUrl}/api/`;
  }
}
