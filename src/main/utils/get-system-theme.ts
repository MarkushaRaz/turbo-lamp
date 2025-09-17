import { winSystemUsesLightTheme } from 'aktru-recorder-native';
import { IS_WINDOWS } from '_shared/constants';
import { SystemTheme } from '_main/enums';

export function getSystemTheme() {
  return IS_WINDOWS && winSystemUsesLightTheme() ? SystemTheme.Light : SystemTheme.Dark;
}
