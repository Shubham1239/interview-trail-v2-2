import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { authTokenAtom, currentUserAtom, authLoadingAtom } from './atoms/auth';
import { configureAxiosClient } from './api/axios';
import { fetchMe } from './api/auth';
import { ROLES } from './roles';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import ToastViewport from './components/ui/Toast';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import PostPage from './pages/PostPage';
import PostFormPage from './pages/PostFormPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  const token = useRecoilValue(authTokenAtom);
  const setUser = useSetRecoilState(currentUserAtom);
  const setLoading = useSetRecoilState(authLoadingAtom);

  // api/axios.js is a plain file, not a component — it can't read Recoil
  // state itself. These two give it a way to: read the current token, and
  // clear the session if a request comes back 401.
  const getToken = useRecoilCallback(function makeGetToken({ snapshot }) {
    return function getToken() {
      return snapshot.getLoadable(authTokenAtom).getValue();
    };
  }, []);

  const clearSession = useRecoilCallback(function makeClearSession({ reset }) {
    return function clearSession() {
      reset(authTokenAtom);
      reset(currentUserAtom);
    };
  }, []);

  useEffect(
    function wireAxios() {
      configureAxiosClient({ getToken: getToken, onUnauthorized: clearSession });
    },
    [getToken, clearSession]
  );

  // If a token was already saved from a previous visit, confirm it's
  // still valid and load the user's profile.
  useEffect(
    function checkExistingSession() {
      if (!token) {
        setLoading(false);
        return;
      }
      fetchMe()
        .then(setUser)
        .catch(function handleFailure() {
          clearSession();
        })
        .finally(function stopLoading() {
          setLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/posts/:postId" element={<PostPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/posts/new" element={<PostFormPage />} />
                <Route path="/posts/:postId/edit" element={<PostFormPage />} />
              </Route>

              <Route element={<ProtectedRoute minRole={ROLES.MODERATOR} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>

              <Route path="*" element={<p className="py-16 text-center">Page not found.</p>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastViewport />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
