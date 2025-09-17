export const IS_DEBUG_STORE = process.env.DEBUG_STORE === 'true';
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_DEV_OR_DEBUG = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
export const IS_PROD = process.env.NODE_ENV === 'production';
