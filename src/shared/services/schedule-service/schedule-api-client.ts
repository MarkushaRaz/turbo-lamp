import axios, { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import https from 'https';
import { getScheduleToken, getScheduleTrustedCA } from '_shared/services/schedule-service/settings';
import { isHttps, isUntrustedSslAllowed } from '_shared/utils';

const clientConfig: CreateAxiosDefaults = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const dateTimeFields = ['created_at', 'updated_at', 'start_time', 'end_time', 'last_online'];
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;

function isDateTimeField(fieldName: string) {
  return dateTimeFields.includes(fieldName);
}

function isIsoDateString(value: unknown): boolean {
  return !!value && typeof value === 'string' && isoDateFormat.test(value);
}

function convertIsoDateStringsToDateObjects(data: Record<string, unknown>) {
  if (!data && typeof data !== 'object') return;

  for (const key of Object.keys(data)) {
    const value = data[key];
    if (isDateTimeField(key) && isIsoDateString(value)) {
      data[key] = new Date(value as string);
    } else if (value && typeof value === 'object') {
      convertIsoDateStringsToDateObjects(value as Record<string, unknown>);
    }
  }
}

function attachHttpsAgent(config: InternalAxiosRequestConfig): void {
  if (!config.url || !isHttps(config.url)) {
    return;
  }

  const allowUntrustedSSL = isUntrustedSslAllowed();
  const trustedCA = getScheduleTrustedCA();

  if (!allowUntrustedSSL && !trustedCA) {
    return;
  }

  const agentOptions: https.AgentOptions = {};

  if (allowUntrustedSSL) {
    agentOptions.rejectUnauthorized = false;
  } else if (trustedCA) {
    agentOptions.ca = trustedCA;
  }

  config.httpsAgent = new https.Agent(agentOptions);
}

const client = axios.create(clientConfig);

client.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getScheduleToken()}`;
  attachHttpsAgent(config);
  return config;
});

client.interceptors.response.use((response) => {
  convertIsoDateStringsToDateObjects(response.data);
  return response;
});

export default client;
