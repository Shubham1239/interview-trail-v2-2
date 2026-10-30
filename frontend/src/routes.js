// Every path in the app is named here once — pages and links both import
// from this file instead of typing raw strings, so a path only ever
// changes in one place.
export const ROUTES = Object.freeze({
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  POST_DETAIL: '/posts/:postId',
  POST_CREATE: '/posts/new',
  POST_EDIT: '/posts/:postId/edit',
  DASHBOARD: '/dashboard',
});

export function postDetailPath(postId) {
  return `/posts/${postId}`;
}

export function postEditPath(postId) {
  return `/posts/${postId}/edit`;
}
