import axios from 'axios';
const VITE_CONVERTKIT_API_URL = import.meta.env.VITE_CONVERTKIT_API_URL;
// import dotenv from '../../src/utilities/'

const httpClient = axios.create({
  baseURL: `${VITE_CONVERTKIT_API_URL}`,
});

httpClient.defaults.headers.common['Accept'] = 'application/json';
httpClient.defaults.headers.common['Content-Type'] = 'application/json';
httpClient.defaults.timeout = 5000;

export { httpClient };
