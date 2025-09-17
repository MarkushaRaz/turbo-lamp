import path from 'path';
import { app } from 'electron';

export const DEFAULT_LOG_PATH = path.join(app.getPath('userData'), 'logs');
export const DEFAULT_RECORDING_PATH = path.join(app.getPath('userData'), 'Recordings');
export const UPDATED_FILE_PATH = path.join(app.getPath('userData'), '.updated');
export const LICENSE_FILE_PATH = path.join(app.getPath('userData'), 'License');
