import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from './ui/Button';
import { isModeratorOrAbove } from '../roles';
import { ROUTES } from '../routes';

export default function Navbar() {
  const auth = useAuth();

  function handleLogout() {
    auth.logout();
  }

  return (
    <header className="border-b border-ink-900/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to={ROUTES.HOME} className="font-display text-xl font-semibold">
          Interview Trail
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to={ROUTES.HOME} className="hover:text-trailmark-dark">
            Feed
          </NavLink>
          {auth.isAuthenticated && isModeratorOrAbove(auth.user?.role) && (
            <NavLink to={ROUTES.DASHBOARD} className="hover:text-trailmark-dark">
              Dashboard
            </NavLink>
          )}
          {auth.isAuthenticated ? (
            <>
              <Link to={ROUTES.POST_CREATE}>
                <Button size="sm" variant="accent">Share an experience</Button>
              </Link>
              <button onClick={handleLogout} className="text-ink-500 hover:text-ink-900">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="hover:text-trailmark-dark">Log in</Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="sm" variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
