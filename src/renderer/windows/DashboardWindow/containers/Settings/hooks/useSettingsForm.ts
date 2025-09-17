import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import log from 'electron-log';
import { SettingsState } from '_shared/types';
import { setMultipleSettingsAction } from '_shared/actions';
import { asError } from '_shared/utils';
import { validateSettings, validateScheduleSettingsBeforeSave, ValidationErrors } from '../validation';

const logger = log.scope('Settings');

interface SaveResult {
  success: boolean;
  error?: string;
}

export function useSettingsForm(initialSettings: SettingsState) {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors<SettingsState>>({});
  const [isValid, setIsValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    const errors = validateSettings(settings);
    setValidationErrors(errors);
    setIsValid(_.isEmpty(errors));
  }, [settings]);

  const handleSettingsChange = useCallback(
    (stateSlice: Partial<SettingsState>) => {
      const newSettings = { ...settings, ...stateSlice };
      setSettings(newSettings);
      setIsDirty(!_.isEqual(initialSettings, newSettings));
    },
    [settings, initialSettings],
  );

  const resetForm = useCallback(() => {
    setSettings(initialSettings);
    setIsDirty(false);
  }, [initialSettings]);

  const resetDirty = useCallback(() => {
    setIsDirty(false);
  }, []);

  const saveSettings = useCallback(async (): Promise<SaveResult> => {
    if (!isDirty || !isValid || isSaving) {
      return { success: false, error: 'Invalid save conditions' };
    }

    setIsSaving(true);

    try {
      logger.info('Validating settings before saving...');
      await validateScheduleSettingsBeforeSave(settings);

      logger.info('Saving settings...');
      dispatch(setMultipleSettingsAction(settings));
      resetDirty();

      logger.info('Settings have been saved successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = asError(error).message;
      logger.warn(`Can't save settings. Reason: ${errorMessage}`, asError(error));
      return { success: false, error: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, [settings, isDirty, isValid, isSaving, dispatch, resetDirty]);

  return {
    handleSettingsChange,
    isDirty,
    isSaving,
    isValid,
    resetDirty,
    resetForm,
    saveSettings,
    settings,
    validationErrors,
  };
}
