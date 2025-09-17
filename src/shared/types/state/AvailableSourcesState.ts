import { CaptureSource } from '_shared/types/capture';

export interface AvailableSourcesState {
  audioCaptureSources: CaptureSource[];
  cameraCaptureSources: CaptureSource[];
  desktopCaptureSources: CaptureSource[];
}
