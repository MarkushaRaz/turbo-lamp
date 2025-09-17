import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import https from 'https';
import { getSettings } from '_main/providers';
import { removeTrailingSlashes } from '_shared/utils';
import { Entry } from '_main/database/entities';
import log from 'electron-log';

const logger = log.scope('SakaiService');

const DEFAULT_PLAYER_ID = 23448169;

export class SakaiService {
  private static sendRequestToSakai(sakaiIdcs: string, name: string, data: Buffer): Promise<AxiosResponse> {
    logger.debug('Send request to sakai');
    const { sakaiUrl, sakaiLogin, sakaiPassword, sakaiTrustedCA, allowUntrustedSSL } = getSettings();

    if (!sakaiUrl || !sakaiLogin || !sakaiPassword) {
      return Promise.reject(new Error('Some Sakai connection settings are missing.'));
    }

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'User-Agent': 'curl',
      },
      auth: {
        username: sakaiLogin,
        password: sakaiPassword,
      },
    };

    if (sakaiUrl.startsWith('https://')) {
      const httpsAgentOptions: https.AgentOptions = {};

      if (allowUntrustedSSL) {
        httpsAgentOptions.rejectUnauthorized = false;
      } else if (sakaiTrustedCA) {
        httpsAgentOptions.ca = sakaiTrustedCA;
      }

      axiosConfig.httpsAgent = new https.Agent(httpsAgentOptions);
    }

    return axios.post(
      `${removeTrailingSlashes(sakaiUrl)}/sakai-content-tool/add_resource?idcs=${sakaiIdcs}&cname=${encodeURI(name)}`,
      data,
      axiosConfig,
    );
  }

  private static generatePlayerEmbedCode(entryId: string) {
    logger.debug('Generate player embed code');
    const { serviceUrl, servicePartnerId, moodlePlayerId } = getSettings();

    if (!serviceUrl || !servicePartnerId) return '';

    let playerId = moodlePlayerId;
    let flashvars = '';

    if (!playerId) {
      playerId = DEFAULT_PLAYER_ID;
      flashvars =
        '&flashvars[logo.plugin]=false&flashvars[closedCaptions.plugin]=true&flashvars[dualScreen.plugin]=true';
    }

    return (
      '<iframe ' +
      'id="aktru-player" ' +
      `src="${removeTrailingSlashes(serviceUrl)}/p/${servicePartnerId}/sp/${servicePartnerId}00/embedIframeJs/` +
      `uiconf_id/${playerId}/partner_id/${servicePartnerId}?` +
      `iframeembed=true&playerId=aktru-player&entry_id=${entryId}${flashvars}" ` +
      'width="640" height="360" allowfullscreen webkitallowfullscreen mozAllowFullScreen ' +
      'allow="autoplay *; fullscreen *; encrypted-media *" frameborder="0">' +
      '</iframe>'
    );
  }

  public static addEntryPlayerIntoSakaiModule(entry: Entry) {
    logger.debug('Embed entry player into sakai service');
    if (!entry.primaryKalturaEntryId || !entry.sakaiIdcs) return Promise.resolve();

    const html = SakaiService.generatePlayerEmbedCode(entry.primaryKalturaEntryId);

    return SakaiService.sendRequestToSakai(entry.sakaiIdcs, entry.name, Buffer.from(html));
  }
}
