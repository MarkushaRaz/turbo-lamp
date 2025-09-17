import { ProcessEnvKey } from '_shared/enums';

export function isUntrustedSslAllowed() {
  return process.env[ProcessEnvKey.ALLOW_UNTRUSTED_SSL];
}
