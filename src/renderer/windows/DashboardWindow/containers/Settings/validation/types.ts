import { SettingsState } from '_shared/types';

export type ValidationRule<T> = (value: T, settings: SettingsState) => boolean;

export type ValidationRuleMap<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export type ValidationErrors<T> = {
  [K in keyof T]?: boolean;
};
