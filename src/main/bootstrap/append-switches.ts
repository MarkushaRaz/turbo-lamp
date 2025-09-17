import { app } from 'electron';

export function appendSwitches() {
  // We need this because of https://github.com/electron/electron/issues/18214
  app.commandLine.appendSwitch('disable-site-isolation-trials');

  // Enable Opus RED field trial.
  app.commandLine.appendSwitch('force-fieldtrials', 'WebRTC-Audio-Red-For-Opus/Enabled/');

  // Allow deprecated plan-b with Electron.js 17.0.0. We'll need to address:
  app.commandLine.appendSwitch('disable-features', 'RTCDisallowPlanBOutsideDeprecationTrial');

  // Enable optional PipeWire support.
  if (!app.commandLine.hasSwitch('enable-features')) {
    app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer');
  }
}
