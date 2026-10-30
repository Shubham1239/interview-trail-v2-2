import { selector } from 'recoil';
import { authTokenAtom, currentUserAtom } from '../atoms/auth';

// it checks if the user is authenticated by checking if both the auth token and current user are present. If both are present, it returns true, indicating that the user is authenticated; otherwise, it returns false.
export const isAuthenticatedSelector = selector({
  key: 'isAuthenticated',
  get: function get({ get }) {
    return Boolean(get(authTokenAtom)) && Boolean(get(currentUserAtom));
  },
});
