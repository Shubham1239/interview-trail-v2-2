import { atom } from 'recoil';

const TOKEN_KEY = 'iep_auth_token';

/**
 * The JWT is mirrored to localStorage only inside this atom's effect —
 * no other file touches localStorage directly, so the storage strategy
 * can change (e.g. to a cookie) in one place later.
 */
export const authTokenAtom = atom({
  key: 'authToken',
  default: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  effects: [
    function syncTokenToStorage({ onSet }) {
      onSet(function handleSet(newToken) {
        if (newToken) {
          localStorage.setItem(TOKEN_KEY, newToken);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      });
    },
  ],
});

/** The logged-in user's profile. Null when logged out or not yet fetched. */
export const currentUserAtom = atom({
  key: 'currentUser',
  default: null, // { id, name, email, role }
});

/** True while the app is checking whether a saved token is still valid. */
export const authLoadingAtom = atom({
  key: 'authLoading',
  default: true,
});
