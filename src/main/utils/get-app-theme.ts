import { nativeTheme } from 'electron';
import { AppTheme } from '_main/enums';

export function getAppTheme() {
  return nativeTheme.shouldUseDarkColors ? AppTheme.Dark : AppTheme.Light;
}
