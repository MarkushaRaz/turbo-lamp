import { app } from 'electron';
import i18n from 'i18next';
import { IS_PROD, START_MINIMIZED_ARG } from '_shared/constants';

export function ensureAutorun() {
  if (!IS_PROD) return;
  app.setLoginItemSettings({
    name: i18n.t<string>('app.name'),
    openAtLogin: true,
    path: app.getPath('exe'),
    args: [START_MINIMIZED_ARG],
  });
}
