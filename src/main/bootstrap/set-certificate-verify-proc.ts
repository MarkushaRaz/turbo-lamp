import crypto from 'crypto';
import { session } from 'electron';
import { getSettings } from '_main/providers';
import log from 'electron-log';

type ProcHandlerCallback = (verificationResult: number) => void;
type Certificate = string;

const logger = log.scope('CertificateVerifyProc');
const VERIFICATION_SUCCESS = 0;
const VERIFICATION_FAILURE = -2;

const trustedFingerprints = new Set<string>();

function calculateCertificateFingerprint(certPem: Certificate): string | null {
  try {
    return crypto
      .createHash('sha256')
      .update(crypto.createPublicKey(certPem).export({ type: 'spki', format: 'der' }))
      .digest('hex');
  } catch (error) {
    logger.error('Error calculating certificate fingerprint:', error);
    return null;
  }
}

function compareCertificates(certPem1: Certificate, certPem2: Certificate): boolean {
  const fingerprint1 = calculateCertificateFingerprint(certPem1);
  const fingerprint2 = calculateCertificateFingerprint(certPem2);

  if (fingerprint1 === null || fingerprint2 === null) {
    return false;
  }

  return fingerprint1 === fingerprint2;
}

function verifyCertificateAgainstTrustedCAs(certificate: Certificate, trustedCAs: Certificate[]): boolean {
  return trustedCAs.some((trustedCA) => compareCertificates(certificate, trustedCA));
}

function certificateVerifyProcHandler(request: Electron.Request, callback: ProcHandlerCallback): void {
  const { hostname, certificate, verificationResult } = request;

  logger.info(`Verifying certificate ${certificate.fingerprint} for ${hostname}`);

  const { allowUntrustedSSL, kalturaTrustedCA, meetTrustedCA, moodleTrustedCA, sakaiTrustedCA, scheduleTrustedCA } =
    getSettings();

  if (verificationResult === 'net::OK') {
    logger.info('Certificate is trusted by default, skipping verification');
    callback(VERIFICATION_SUCCESS);
    return;
  }

  if (allowUntrustedSSL) {
    logger.info('Untrusted SSL is allowed, skipping verification');
    callback(VERIFICATION_SUCCESS);
    return;
  }

  if (trustedFingerprints.has(certificate.fingerprint)) {
    logger.info('Certificate is trusted by fingerprint, it was already verified');
  }

  logger.info('Untrusted SSL is not allowed, verifying certificate against trusted CAs');

  const trustedCAs = [kalturaTrustedCA, meetTrustedCA, moodleTrustedCA, sakaiTrustedCA, scheduleTrustedCA].filter(
    Boolean,
  );

  if (verifyCertificateAgainstTrustedCAs(certificate.data, trustedCAs)) {
    logger.info('Certificate is trusted, verification completed');
    trustedFingerprints.add(certificate.fingerprint);
    callback(VERIFICATION_SUCCESS);
    return;
  }

  logger.warn('Certificate is not trusted, failing verification');
  callback(VERIFICATION_FAILURE);
}

export function setCertificateVerifyProc(): void {
  session.defaultSession.setCertificateVerifyProc(certificateVerifyProcHandler);
}
