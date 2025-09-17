import { DateAttributes } from '../common/DateAttributes';
import { RelationToMany } from '../relations';
import { Policy } from './Policy';

export interface Partner extends DateAttributes {
  partnerId: string;
  name: string;
  kalturaUrl: string | null;
  kalturaTokenId: string | null;
  kalturaTokenSecret: string | null;
  scheduleUrl: string | null;
  scheduleToken: string | null;
  moodleUrl: string | null;
  moodleToken: string | null;
  sakaiUrl: string | null;
  sakaiToken: string | null;
  sakaiLogin: string | null;
  sakaiPassword: string | null;
  meetBridgeUrl: string | null;
  meetBridgeToken: string | null;
  environment: 'cloud' | 'onprem';
  policies: RelationToMany<Policy>;
  kalturaTrustedCA: string | null;
  scheduleTrustedCA: string | null;
  meetTrustedCA: string | null;
  moodleTrustedCA: string | null;
  sakaiTrustedCA: string | null;
  allowUntrustedSSL: boolean | null;
}
