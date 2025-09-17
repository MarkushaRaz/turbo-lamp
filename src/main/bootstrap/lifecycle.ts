import { app, dialog } from 'electron';
import i18n from 'i18next';
import { getSettings, getState } from '_main/providers';
import { isAutoUpdating } from '_main/services';
import { logAndQuitWithErrorBox } from '_main/utils';
import { SplashWindow } from '_main/windows';
import { windowManager } from '_main/window-manager';
import { RecordingStatus } from '_shared/enums';

export function wireUpLifeCycleEventHandlers() {
  app.on('second-instance', () => {
    windowManager.showCurrentOrOpenDefaultWindow().catch(logAndQuitWithErrorBox);
  });

  app.on('before-quit', () => {
    const isSplashWindow = windowManager.getCurrentWindow()?.className === SplashWindow.name;
    const state = getState();

    if (state.recording.status === RecordingStatus.Started || state.recording.status === RecordingStatus.Paused) {
      dialog.showErrorBox(
        i18n.t('app.error.unableToQuit.ongoingRecording.title'),
        i18n.t('app.error.unableToQuit.ongoingRecording.content'),
      );
    } else if (getSettings().scheduleEnabled && !isAutoUpdating() && !isSplashWindow) {
      dialog.showErrorBox(
        i18n.t('app.error.unableToQuit.scheduleEnabled.title'),
        i18n.t('app.error.unableToQuit.scheduleEnabled.content'),
      );
    } else {
      windowManager.getCurrentWindow()?.setCanClose(true);
    }
  });
}
