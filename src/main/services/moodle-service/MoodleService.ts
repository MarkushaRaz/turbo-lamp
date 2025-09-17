import { AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';
import https from 'https';
import { getSettings } from '_main/providers';
import { removeTrailingSlashes } from '_shared/utils';
import log from 'electron-log';
import client from './moodle-api-client';
import { MoodleWsFunction } from './types';

const logger = log.scope('MoodleService');

const DEFAULT_PLAYER_ID = 23448169;

export class MoodleService {
  private static sendRequestToMoodleWebService(data: { [key: string]: string | number }): Promise<AxiosResponse> {
    logger.debug('Send request to moodle web service');
    const formData = new FormData();

    const { moodleToken, moodleUrl, moodleTrustedCA, allowUntrustedSSL } = getSettings();

    formData.append('wstoken', moodleToken);
    formData.append('moodlewsrestformat', 'json');

    for (const [key, value] of Object.entries(data)) {
      if (value) {
        formData.append(key, value);
      }
    }

    const url = removeTrailingSlashes(moodleUrl);

    const axiosConfig: AxiosRequestConfig = {
      headers: { ...formData.getHeaders() },
    };

    if (url.startsWith('https://')) {
      const httpsAgentOptions: https.AgentOptions = {};

      if (allowUntrustedSSL) {
        httpsAgentOptions.rejectUnauthorized = false;
      } else if (moodleTrustedCA) {
        httpsAgentOptions.ca = moodleTrustedCA;
      }

      axiosConfig.httpsAgent = new https.Agent(httpsAgentOptions);
    }

    return client.post(`${url}/webservice/rest/server.php`, formData, axiosConfig);
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

  public static embedEntryPlayerIntoLesson(entryId: string, cmid: number | string) {
    logger.debug('Embed entry player into moodle lesson');
    const html = MoodleService.generatePlayerEmbedCode(entryId);

    return MoodleService.sendRequestToMoodleWebService({
      wsfunction: MoodleWsFunction.EmbedPlayerIntoPage,
      cmid,
      html,
    });
  }
}
