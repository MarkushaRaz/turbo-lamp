import { SettingsState } from '_shared/types';
import { isIPv4, isIPv4WithOptionalPort, isUrl } from '_shared/utils';
import { ValidationRule, ValidationRuleMap } from './types';

const kalturaTokenIdPattern = /^\d_[\da-z]{8}$/;
const kalturaSecretPattern = /^[\da-f]{32}$/;

export const rules = {
  isValidUrl: ((value: string) => !!value && isUrl(value)) as ValidationRule<string>,

  isNotEmpty: ((value: string) => !!value && value.trim().length > 0) as ValidationRule<string>,

  isIPv4: ((value: string) => isIPv4(value)) as ValidationRule<string>,

  isIPv4WithPort: ((value: string) => isIPv4WithOptionalPort(value)) as ValidationRule<string>,

  isPositive: ((value: number) => value >= 0) as ValidationRule<number>,

  isAboveMin: (min: number): ValidationRule<number> => {
    return (value: number) => value >= min;
  },

  matchesPattern: (pattern: RegExp): ValidationRule<string> => {
    return (value: string) => !!value && pattern.test(value);
  },

  conditional: <T>(condition: (settings: SettingsState) => boolean, rule: ValidationRule<T>): ValidationRule<T> => {
    return (value: T, settings: SettingsState) => {
      if (!condition(settings)) return true;
      return rule(value, settings);
    };
  },
};

export const settingsValidationRules: ValidationRuleMap<SettingsState> = {
  serviceUrl: rules.isValidUrl,
  servicePartnerId: rules.isAboveMin(100),
  servicePartnerSecret: rules.conditional(
    (settings) => !settings.serviceTokenId || !settings.serviceTokenSecret,
    rules.matchesPattern(kalturaSecretPattern),
  ),
  serviceTokenId: rules.conditional(
    (settings) => !settings.servicePartnerSecret,
    rules.matchesPattern(kalturaTokenIdPattern),
  ),
  serviceTokenSecret: rules.conditional(
    (settings) => !settings.servicePartnerSecret,
    rules.matchesPattern(kalturaSecretPattern),
  ),
  scheduleUrl: rules.conditional((settings) => settings.scheduleEnabled, rules.isValidUrl),
  scheduleRoomNumber: rules.conditional((settings) => settings.scheduleEnabled, rules.isNotEmpty),
  daysToKeepData: rules.isPositive,
  recordingPath: rules.isNotEmpty,
  ptzCameraIp: rules.conditional((settings) => settings.ptzCameraControlsEnabled, rules.isIPv4),
  moodleUrl: rules.conditional((settings) => settings.moodleEnabled, rules.isValidUrl),
  moodleToken: rules.conditional((settings) => settings.moodleEnabled, rules.matchesPattern(/^[a-f\d]{32}$/i)),
  sakaiUrl: rules.conditional((settings) => settings.sakaiEnabled, rules.isValidUrl),
  sakaiLogin: rules.conditional((settings) => settings.sakaiEnabled, rules.isNotEmpty),
  sakaiPassword: rules.conditional((settings) => settings.sakaiEnabled, rules.isNotEmpty),
  audioProcessorIp: rules.conditional((settings) => settings.audioProcessorControlsEnabled, rules.isIPv4WithPort),
  communicationBridgeUrl: rules.conditional((settings) => settings.scheduleCommunicationEnabled, rules.isValidUrl),
};
