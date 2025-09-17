import axios, { RawAxiosRequestConfig } from 'axios';
import { getFpsConnectionConfig } from 'aktru-recorder-native';
import log from 'electron-log';
import fs from 'fs';
import i18n from 'i18next';
import { createEncryptor, SimpleEncryptor } from 'simple-encryptor';
import { LICENSE_FILE_PATH } from '_main/constants';
import { IS_DEV, IS_PROD } from '_shared/constants';
import { getSettings, getState, getStore } from '_main/providers';
import { setLicenseEntitlementsAction, setMultipleSettingsAction } from '_shared/actions';
import { SettingsState } from '_shared/types';
import { AudioProcessorType } from '_shared/enums';
import { asError, isIPv4, isIPv4WithOptionalPort } from '_shared/utils';
import { ListResponse, License } from './types';

const logger = log.scope('LicenseService');

declare const FPS_API_TOKEN: string | undefined;

export class LicenseService {
  private static encryptor: SimpleEncryptor;

  private static async getCloudLicense(
    fingerprint: string,
  ): Promise<{ isCloudAvailable: boolean; isCloudLicenseValid: boolean; license: License | undefined }> {
    logger.info(`Trying to get cloud license`);
    let isCloudAvailable = false;
    let isCloudLicenseValid = false;
    let license: License | undefined;

    const requestConfig: RawAxiosRequestConfig = {};
    const fpsConfig = getFpsConnectionConfig(fingerprint, FPS_API_TOKEN || '', getState().app.uuid);

    requestConfig.headers = { Authorization: `Bearer ${fpsConfig.token}` };

    try {
      logger.debug('Trying to connect to fps service');
      const {
        data: { data, meta },
      } = await axios.get<ListResponse<License>>(fpsConfig.url, requestConfig);

      isCloudAvailable = true;
      isCloudLicenseValid = meta.pagination.total === 1;

      logger.debug(`Is cloud license valid: ${isCloudLicenseValid}`);
      if (isCloudLicenseValid && data.length) {
        [{ attributes: license }] = data;
      }
    } catch (e) {
      logger.warn(`Unable to check the fingerprint with the cloud.`, asError(e));
    }

    return { isCloudAvailable, isCloudLicenseValid, license };
  }

  private static unlinkLocalLicense() {
    try {
      logger.info('Trying to unlink license file');
      fs.unlinkSync(LICENSE_FILE_PATH);
    } catch (e) {
      logger.warn('Unable to unlink the license file, ignoring...', asError(e));
    }
  }

  private static saveLocalLicense(fingerprint: string) {
    try {
      logger.debug('Save license locally');
      const license = LicenseService.encryptor.encrypt(fingerprint);
      fs.writeFileSync(LICENSE_FILE_PATH, license);
    } catch (e) {
      logger.warn('Unable to save the license data, ignoring...', asError(e));
    }
  }

  private static hasValidLocalLicense(fingerprint: string) {
    let isLicensed = false;

    try {
      logger.debug('Check local license is valid');
      const license = fs.readFileSync(LICENSE_FILE_PATH).toString();
      const savedFingerprint = LicenseService.encryptor.decrypt(license);
      isLicensed = fingerprint === savedFingerprint;
    } catch (e) {
      logger.warn('Unable to read/parse the local license file.', asError(e));
    }

    logger.debug(`Is local license valid: ${isLicensed}`);
    return isLicensed;
  }

  public static applyEntitlements(license: License) {
    logger.info('Looking for policies associated with the license...');

    const policies = license.policies.data.length
      ? license.policies.data
      : license.partner.data?.attributes.policies.data;

    if (!policies || !policies.length) {
      logger.info(`No policies found. Entitlement's won't be applied.`);
      return;
    }

    logger.info(`Found ${policies.length} policies associated with the license.`);
    logger.info(`Gathering entitlements...`);

    const entitlements = policies
      .map((p) => p.attributes.entitlements.data)
      .flat()
      .map((e) => e.attributes.code);

    logger.info(`Found ${entitlements.length} entitlements:`, JSON.stringify(entitlements));

    getStore().dispatch(setLicenseEntitlementsAction(entitlements));
  }

  private static applyCloudSettings(license: License) {
    logger.info('Starting applying cloud setting');
    const instanceSettings = license;
    const partnerSettings = license.partner.data?.attributes;

    const {
      serviceUrl,
      servicePartnerId,
      serviceTokenId,
      serviceTokenSecret,
      kalturaTrustedCA,
      scheduleUrl,
      scheduleToken,
      scheduleTrustedCA,
      scheduleRoomNumber,
      moodleUrl,
      moodleToken,
      moodleTrustedCA,
      sakaiUrl,
      sakaiLogin,
      sakaiPassword,
      sakaiTrustedCA,
      ptzCameraIp,
      communicationBridgeUrl,
      communicationBridgeToken,
      meetTrustedCA,
    } = getSettings();

    const settings: Partial<SettingsState> = {};

    if (partnerSettings?.kalturaUrl && (IS_PROD || !serviceUrl)) {
      settings.serviceUrl = partnerSettings.kalturaUrl;
    }

    if (partnerSettings?.kalturaTrustedCA !== undefined && (IS_PROD || !kalturaTrustedCA)) {
      settings.kalturaTrustedCA = partnerSettings.kalturaTrustedCA ?? '';
    }

    if (partnerSettings?.partnerId && (IS_PROD || !servicePartnerId)) {
      settings.servicePartnerId = Number(partnerSettings.partnerId) || 0;
    }

    if (partnerSettings?.kalturaTokenId && (IS_PROD || !serviceTokenId)) {
      settings.serviceTokenId = partnerSettings.kalturaTokenId;
    }

    if (partnerSettings?.kalturaTokenSecret && (IS_PROD || !serviceTokenSecret)) {
      settings.serviceTokenSecret = partnerSettings.kalturaTokenSecret;
    }

    if (partnerSettings?.scheduleUrl && (IS_PROD || !scheduleUrl)) {
      settings.scheduleUrl = partnerSettings.scheduleUrl;
    }

    if (partnerSettings?.scheduleTrustedCA !== undefined && (IS_PROD || !scheduleTrustedCA)) {
      settings.scheduleTrustedCA = partnerSettings.scheduleTrustedCA ?? '';
    }

    if (partnerSettings?.scheduleToken) {
      settings.scheduleToken = partnerSettings.scheduleToken;
    } else if (!scheduleToken) {
      settings.scheduleEnabled = false;
    }

    if (instanceSettings.scheduleRoomNumber && (IS_PROD || !scheduleRoomNumber)) {
      settings.scheduleRoomNumber = instanceSettings.scheduleRoomNumber;
    }

    if (partnerSettings?.moodleUrl && (IS_PROD || !moodleUrl)) {
      settings.moodleUrl = partnerSettings.moodleUrl;
    }

    if (partnerSettings?.moodleTrustedCA !== undefined && (IS_PROD || !moodleTrustedCA)) {
      settings.moodleTrustedCA = partnerSettings.moodleTrustedCA ?? '';
    }

    if (partnerSettings?.moodleToken && (IS_PROD || !moodleToken)) {
      settings.moodleToken = partnerSettings.moodleToken;
    }

    if (partnerSettings?.sakaiUrl && (IS_PROD || !sakaiUrl)) {
      settings.sakaiUrl = partnerSettings.sakaiUrl;
    }

    if (partnerSettings?.sakaiTrustedCA !== undefined && (IS_PROD || !sakaiTrustedCA)) {
      settings.sakaiTrustedCA = partnerSettings.sakaiTrustedCA ?? '';
    }

    if (partnerSettings?.sakaiLogin && (IS_PROD || !sakaiLogin)) {
      settings.sakaiLogin = partnerSettings.sakaiLogin;
    }

    if (partnerSettings?.sakaiPassword && (IS_PROD || !sakaiPassword)) {
      settings.sakaiPassword = partnerSettings.sakaiPassword;
    }

    if (instanceSettings.ptzCameraIp && isIPv4(instanceSettings.ptzCameraIp) && (IS_PROD || !ptzCameraIp)) {
      settings.ptzCameraIp = instanceSettings.ptzCameraIp;
      settings.ptzCameraControlsEnabled = true;
    }

    if (
      instanceSettings.audioProcessorIp &&
      isIPv4WithOptionalPort(instanceSettings.audioProcessorIp) &&
      instanceSettings.audioProcessorType &&
      Object.values<AudioProcessorType[keyof AudioProcessorType]>(AudioProcessorType).includes(
        instanceSettings.audioProcessorType,
      )
    ) {
      settings.audioProcessorIp = instanceSettings.audioProcessorIp;
      settings.audioProcessorType = instanceSettings.audioProcessorType;
      settings.audioProcessorControlsEnabled = true;
    }

    if (partnerSettings?.meetBridgeUrl && (IS_PROD || !communicationBridgeUrl)) {
      settings.communicationBridgeUrl = partnerSettings.meetBridgeUrl;
    }

    if (partnerSettings?.meetTrustedCA !== undefined && (IS_PROD || !meetTrustedCA)) {
      settings.meetTrustedCA = partnerSettings.meetTrustedCA ?? '';
    }

    if (partnerSettings?.meetBridgeToken && (IS_PROD || !communicationBridgeToken)) {
      settings.communicationBridgeToken = partnerSettings.meetBridgeToken;
    }

    settings.allowUntrustedSSL = !!partnerSettings?.allowUntrustedSSL;

    logger.debug('Cloud settings applyied');
    getStore().dispatch(setMultipleSettingsAction(settings));
  }

  public static async checkLicense() {
    logger.info('Check license');
    const { fingerprint } = getState().app;

    if (!fingerprint) {
      throw new Error(i18n.t<string>('app.error.unlicensed'));
    }

    logger.debug('Create license encryptor');
    LicenseService.encryptor = createEncryptor(fingerprint);

    const { isCloudAvailable, isCloudLicenseValid, license } = await LicenseService.getCloudLicense(fingerprint);

    const isLocalLicenseValid = !isCloudAvailable && LicenseService.hasValidLocalLicense(fingerprint);

    if (isCloudAvailable) {
      logger.info('Cloud available');
      LicenseService.unlinkLocalLicense();
    }

    if (license) {
      logger.info('Apply cloud settings');
      LicenseService.applyEntitlements(license);
      LicenseService.applyCloudSettings(license);
    }

    if (isCloudLicenseValid) {
      logger.info(`Cloud license found. Starting the app....`);
      LicenseService.saveLocalLicense(fingerprint);
    } else if (isLocalLicenseValid) {
      logger.info(`Local license found. Starting the app...`);
    } else if (IS_DEV) {
      logger.info('Unregistered fingerprint. Ignoring in dev more and starting the app...');
    } else {
      const error = new Error(i18n.t<string>('app.error.unlicensed'));
      logger.error(`Unregistered fingerprint, most likely unlicensed. Quitting...`, error);
      throw error;
    }
  }
}
