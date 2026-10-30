import axiosClient from './axios';

function unwrap(response) {
  return response.data;
}

export function registerUser(payload) {
  return axiosClient.post('/auth/register', payload).then(unwrap);
}

export function loginUser(payload) {
  return axiosClient.post('/auth/login', payload).then(unwrap);
}

export function fetchMe() {
  return axiosClient.get('/auth/me').then(unwrap);
}

export function logoutUser() {
  return axiosClient.post('/auth/logout').then(unwrap);
}
