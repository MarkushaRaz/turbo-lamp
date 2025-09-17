import { SDRecorderErrorCodes } from './sd-recorder-error-codes';

export interface StreamDeckMessage {
  event?: string;
  code?: SDRecorderErrorCodes;
  message?: string;
  data?: unknown;
}
