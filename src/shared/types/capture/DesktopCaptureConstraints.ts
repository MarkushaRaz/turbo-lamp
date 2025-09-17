export interface DesktopCaptureConstraints {
  audio:
    | boolean
    | {
        mandatory: {
          chromeMediaSource: 'desktop';
        };
      };
  video: {
    mandatory: {
      chromeMediaSource: 'desktop';
      chromeMediaSourceId: string;
    };
  };
}
