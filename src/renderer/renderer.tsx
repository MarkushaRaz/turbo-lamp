import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { HelmetProvider } from 'react-helmet-async';
import { locale as setMomentLocale } from 'moment';
import { CacheProvider } from '@emotion/react';
import log from 'electron-log';
import { AppTheme } from './styles';
import { store } from './store';
import { App } from './containers';
import 'moment-duration-format';
import '@fontsource/roboto';
import { i18n } from './localization';
import './utils/font-observer';

log.transports.console.level = false;

setMomentLocale(i18n.language);

const muiCache = createCache({
  key: 'mui',
  prepend: true,
});

const container = document.createElement('div');
container.id = 'root';
document.body.append(container);

const root = createRoot(container);

root.render(
  <Provider store={store}>
    <HashRouter>
      <HelmetProvider>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={AppTheme}>
            <App />
          </ThemeProvider>
        </CacheProvider>
      </HelmetProvider>
    </HashRouter>
  </Provider>,
);
