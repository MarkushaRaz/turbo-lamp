import crypto from 'crypto';
import log from 'electron-log';
import moment, { duration, Moment } from 'moment';
import kaltura from 'kaltura-client';
import {
  KalturaAppToken,
  KalturaSessionInfo,
  KalturaStartWidgetSessionResponse,
  KalturaUiConfListResponse,
} from 'kaltura-typescript-client/api/types';
import { nativeImage, Notification } from 'electron';
import { getSettings, getState, getStore } from '_main/providers';
import { i18n } from '_renderer/localization';
import { getAssetPath } from '_main/utils';
import { setMoodlePlayerIdSettingAction, setMultipleSettingsAction } from '_shared/actions';
import { RecordingStatus } from '_shared/enums';
import { asError } from '_shared/utils';

const logger = log.scope('KalturaClientService');

const sessionExpiry = duration(1, 'day').asSeconds();
const intervalTime = duration(15, 'minute');

export class KalturaClientManager {
  private static interval: NodeJS.Timeout;

  public static client: kaltura.Client;

  private static expiryDate?: Moment;

  private static connected?: boolean;

  public static get Connected(): boolean {
    return this.connected || false;
  }

  public static async init() {
    logger.debug('Initialize kaltura client');
    await KalturaClientManager.createAppToken();
    KalturaClientManager.client = new kaltura.Client(KalturaClientManager.getNewConfig());
    KalturaClientManager.connected = await KalturaClientManager.logIn(false);
    KalturaClientManager.interval = KalturaClientManager.interval
      ? KalturaClientManager.interval.refresh()
      : setInterval(KalturaClientManager.checkSessionExpiry, intervalTime.asMilliseconds());
    return KalturaClientManager.connected;
  }

  public static async checkConnection() {
    if (!KalturaClientManager.client) {
      return this.init();
    }
    return this.checkSessionExpiry();
  }

  private static async createAppToken() {
    const { servicePartnerId, servicePartnerSecret } = getSettings();

    if (!servicePartnerId || !servicePartnerSecret) {
      logger.debug('Service partner id or secret is not set, skipping app token creation');
      return;
    }

    try {
      logger.debug('Attempting to create a new app token...');
      const client = new kaltura.Client(KalturaClientManager.getNewConfig());

      logger.debug('Starting a new kaltura session...');
      const ks: string = await kaltura.services.session
        .start(servicePartnerSecret, '', kaltura.enums.SessionType.ADMIN, servicePartnerId)
        .execute<string>(client);

      logger.debug(`Kaltura session started successfully`);
      client.setKs(ks);

      logger.debug('Creating a new app token...');
      const appToken = new kaltura.objects.AppToken();
      appToken.setHashType(kaltura.enums.AppTokenHashType.SHA256);
      appToken.setSessionType(kaltura.enums.SessionType.ADMIN);
      appToken.setDescription('Aktru Recorder');
      const result = await kaltura.services.appToken.add(appToken).execute<KalturaAppToken>(client);

      logger.debug(`App token created successfully`);
      getStore().dispatch(
        setMultipleSettingsAction({
          serviceTokenId: result.id,
          serviceTokenSecret: result.token,
          servicePartnerSecret: '',
        }),
      );
    } catch (e) {
      logger.error('Failed to create a new app token:', asError(e).message);
      getStore().dispatch(
        setMultipleSettingsAction({
          servicePartnerSecret: '',
        }),
      );
    }
  }

  private static async checkSessionExpiry() {
    logger.debug('Check session expire');
    if (!KalturaClientManager.expiryDate || KalturaClientManager.expiryDate.isBefore(moment().add('30', 'minutes'))) {
      return KalturaClientManager.logIn();
    }

    try {
      await kaltura.services.session.get().execute(KalturaClientManager.client);
      KalturaClientManager.connected = true;
      logger.debug('Session not expired');
      return true;
    } catch (e) {
      logger.info('KS expired or there is a connection problem. Details:', asError(e));
      return KalturaClientManager.logIn(false);
    }
  }

  private static getNewConfig() {
    logger.debug('Get new kaltura client config');

    const config: kaltura.Configuration = new kaltura.Configuration();
    config.setLogger(null);
    config.serviceUrl = getSettings().serviceUrl;

    if (getSettings().allowUntrustedSSL) {
      config.agentOptions = { rejectUnauthorized: false };
    } else if (getSettings().kalturaTrustedCA) {
      config.agentOptions = { ca: getSettings().kalturaTrustedCA };
    }

    return config;
  }

  private static async logIn(silent = true) {
    const { servicePartnerId, serviceTokenId, serviceTokenSecret } = getSettings();

    try {
      logger.info('Trying to log in and create a new KS...');

      const client = new kaltura.Client(KalturaClientManager.getNewConfig());

      logger.debug('Creating kaltura widget session');
      const widgetId = `_${servicePartnerId}`;
      const widgetSessionResponse: KalturaStartWidgetSessionResponse = await kaltura.services.session
        .startWidgetSession(widgetId, sessionExpiry)
        .execute<KalturaStartWidgetSessionResponse>(client);

      client.setKs(widgetSessionResponse.ks);

      const shasum = crypto.createHash('sha256');
      shasum.update(widgetSessionResponse.ks + serviceTokenSecret);

      const id = serviceTokenId;
      const tokenHash = shasum.digest('hex');
      const type = kaltura.enums.SessionType.ADMIN;
      const userId = '';
      const sessionPrivileges = '';

      logger.debug('Starting kaltura session');
      const kalturaSessionInfo: KalturaSessionInfo = await kaltura.services.appToken
        .startSession(id, tokenHash, userId, type, sessionExpiry, sessionPrivileges)
        .execute<KalturaSessionInfo>(client);

      if ((kalturaSessionInfo as unknown as { error?: unknown }).error) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error("Couldn't parse the kaltura.services.appToken.startSession response");
      }

      KalturaClientManager.expiryDate = moment.unix(kalturaSessionInfo.expiry);
      KalturaClientManager.client.setKs(kalturaSessionInfo.ks);

      logger.info('KS created successfully.');

      await KalturaClientManager.fetchPartnerPlayerId();
      KalturaClientManager.connected = true;
      return true;
    } catch (error) {
      logger.error('Failed to log in or initialize a ks:', asError(error).message);
      logger.debug(`Is kaltura client connected: ${KalturaClientManager.connected}`);
      if (KalturaClientManager.connected === false) return false;
      KalturaClientManager.connected = false;
      const state = getState();
      if (
        (error as { code?: string }).code === 'INVALID_KS' ||
        state.recording.status === RecordingStatus.Started ||
        state.recording.status === RecordingStatus.Paused ||
        silent
      )
        return false;

      new Notification({
        title: i18n.t<string>('kaltura.error.noConnection.title'),
        body: i18n.t<string>('kaltura.error.noConnection.message'),
        icon: nativeImage.createFromPath(getAssetPath('icon.png')),
      }).show();
      return false;
    }
  }

  private static async fetchPartnerPlayerId() {
    try {
      logger.info('Trying to fetch partner player id');

      const filter = new kaltura.objects.UiConfFilter();
      const pager = new kaltura.objects.FilterPager();

      filter.objTypeEqual = kaltura.enums.UiConfObjType.PLAYER;

      const result = await kaltura.services.uiConf
        .listAction(filter, pager)
        .execute<KalturaUiConfListResponse>(KalturaClientManager.client);

      if (!result.totalCount) {
        logger.info('No player was found for this partner.');
        return;
      }

      const playerId = result.objects[0].id;

      if (!playerId) {
        logger.info('No player id found for this partner.');
        return;
      }

      getStore().dispatch(setMoodlePlayerIdSettingAction(playerId));
      logger.info(`Partner player id (${playerId}) successfully fetched and applied to the state.`);
    } catch (e) {
      logger.error('Failed to fetch partner player id:', asError(e).message);
    }
  }
}
