import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { hasMinRole } from '../roles';
import { ROUTES } from '../routes';
import Loader from './ui/Loader';

/** Wrap protected routes: <Route element={<ProtectedRoute minRole="moderator" />}>. */
export default function ProtectedRoute(props) {
  const minRole = props.minRole;
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Checking your session…" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (minRole && !hasMinRole(auth.user?.role, minRole)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
