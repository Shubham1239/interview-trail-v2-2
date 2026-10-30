import { useCallback } from 'react';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { authTokenAtom, currentUserAtom, authLoadingAtom } from '../atoms/auth';
import { isAuthenticatedSelector } from '../selectors/auth';
import { loginUser, registerUser } from '../api/auth';

/** The one place pages call to log in/register/log out, so auth atoms
 * are never written to directly from a page component. */
// ye hook ek centralized place provide karta hai jahan se pages login, register, aur logout actions perform karte hain. Isse ensure hota hai ki auth atoms directly page components se write na ho.
export default function useAuth() {
  const [token, setToken] = useRecoilState(authTokenAtom);
  const [user, setUser] = useRecoilState(currentUserAtom);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const loading = useRecoilValue(authLoadingAtom);
  const resetToken = useResetRecoilState(authTokenAtom);
  const resetUser = useResetRecoilState(currentUserAtom);

  const login = useCallback(
    async function login(credentials) {
      const data = await loginUser(credentials);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    [setToken, setUser]
  );

  const register = useCallback(
    async function register(details) {
      const data = await registerUser(details);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    },
    [setToken, setUser]
  );

  const logout = useCallback(
    function logout() {
      resetToken();
      resetUser();
    },
    [resetToken, resetUser]
  );

  return { token, user, isAuthenticated, loading, login, register, logout };
}
