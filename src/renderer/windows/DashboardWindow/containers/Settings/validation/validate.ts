import { SettingsState } from '_shared/types';
import { ScheduleService } from '_shared/services';
import { i18n } from '_renderer/localization';
import { ValidationErrors, ValidationRule } from './types';
import { settingsValidationRules } from './rules';

export function validateSettings(settings: SettingsState): ValidationErrors<SettingsState> {
  const errors: ValidationErrors<SettingsState> = {};

  for (const [field, rule] of Object.entries(settingsValidationRules)) {
    const key = field as keyof SettingsState;
    const value = settings[key];

    if (!rule) continue;

    const isValid = (rule as ValidationRule<typeof value>)(value, settings);

    if (!isValid) {
      errors[key] = true;
    }
  }

  return errors;
}

export async function validateScheduleSettingsBeforeSave(settings: SettingsState): Promise<void> {
  if (!settings.scheduleEnabled) return;

  const isScheduleUrlValid = await ScheduleService.checkScheduleServiceExistsAtUrl(settings.scheduleUrl);
  if (!isScheduleUrlValid) {
    throw new Error(i18n.t<string>('window.dashboard.settings.validationErrors.invalidScheduleUrl'));
  }

  const isRoomNumberValid = await ScheduleService.checkRoomExistsInSchedule(
    settings.scheduleUrl,
    settings.scheduleRoomNumber,
  );
  if (!isRoomNumberValid) {
    throw new Error(i18n.t<string>('window.dashboard.settings.validationErrors.invalidScheduleRoomNumber'));
  }
}
