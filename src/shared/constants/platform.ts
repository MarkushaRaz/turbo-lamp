import os from 'os';

export const IS_DARWIN = process.platform === 'darwin';
export const IS_WINDOWS = process.platform === 'win32';
export const IS_LINUX = process.platform === 'linux';
export const IS_WINDOWS_11 = process.platform === 'win32' && Number(os.release().split('.')[2]) > 22000;
