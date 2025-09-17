import axios from 'axios';

const client = axios.create();

client.interceptors.response.use(
  (response) => {
    if (typeof response.data !== 'object') {
      throw new Error('Unexpected response from Moodle Web Service');
    }
    if (response.data.exception) {
      throw new Error(`Moodle Web Service Exception (${response.data.message})`);
    }
    return response;
  },
  // eslint-disable-next-line promise/no-promise-in-callback
  (error) => Promise.reject(error),
);

export default client;
