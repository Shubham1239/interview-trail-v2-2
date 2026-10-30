import axios from 'axios';

/**
 * The one axios instance for the whole app — every api/ file imports
 * THIS, never axios directly, so the auth header and error shape stay
 * consistent everywhere.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Filled in from App.jsx once Recoil is ready, so this file has no
// dependency on React and stays easy to test on its own.
let getToken = function defaultGetToken() {
  return null;
};
let onUnauthorized = function defaultOnUnauthorized() {};

export function configureAxiosClient(options) {
  if (options.getToken) getToken = options.getToken;
  if (options.onUnauthorized) onUnauthorized = options.onUnauthorized;
}

axiosClient.interceptors.request.use(function attachToken(config) {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  function onSuccess(response) {
    return response;
  },
  function onError(error) {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default axiosClient;
