import { asError } from '_shared/utils';
import log from 'electron-log';
import FontFaceObserver from 'fontfaceobserver';

const logger = log.scope('FontObserve');

const fontFamilyName = 'Roboto';
const fontLoadedClassName = 'font-loaded';

const fontObserver = new FontFaceObserver('Roboto', {});

fontObserver
  .load()
  .then(() => {
    document.body.classList.add(fontLoadedClassName);
  })
  .catch((e) => {
    logger.error(`${fontFamilyName} font-face couldn't be loaded.`, asError(e));
  });
