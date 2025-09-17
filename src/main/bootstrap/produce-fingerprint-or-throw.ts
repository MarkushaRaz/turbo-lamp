import log from 'electron-log';
import { produceSystemFingerprint } from 'aktru-recorder-native';
import i18n from 'i18next';

const logger = log.scope('Fingerprint');

export async function produceSystemFingerprintOrThrow(): Promise<string> {
  logger.info('Producing the system fingerprint');
  const fingerprint = produceSystemFingerprint();

  if (!fingerprint) {
    logger.error('Failed to produce the system fingerprint');
    throw new Error(i18n.t<string>('app.error.unableToProduceFingerprint'));
  }

  return fingerprint;
}
