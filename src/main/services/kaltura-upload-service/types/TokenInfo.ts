import { KalturaUploadToken } from 'kaltura-typescript-client/api/types';

export interface TokenInfo {
  isValid: boolean;
  token?: KalturaUploadToken;
}
