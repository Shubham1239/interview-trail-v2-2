import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useAuth from '../hooks/useAuth';
import { isAdmin } from '../roles';

/** Shell only — wired for report-review and user-management panels once
 * those endpoints exist on the backend. */
export default function DashboardPage() {
  const auth = useAuth();

  return (
    <div className="mx-auto max-w-4xl py-10">
      <div className="mb-6 flex items-center gap-2">
        <h1 className="font-display text-2xl font-semibold">
          {isAdmin(auth.user?.role) ? 'Admin dashboard' : 'Moderator dashboard'}
        </h1>
        <Badge tone="accent">{auth.user?.role}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="mb-1 font-medium">Reported posts &amp; comments</h2>
          <p className="text-sm text-ink-500">Review queue — not yet connected to the backend.</p>
        </Card>
        {isAdmin(auth.user?.role) && (
          <Card>
            <h2 className="mb-1 font-medium">User management</h2>
            <p className="text-sm text-ink-500">Roles, bans, and account actions — coming soon.</p>
          </Card>
        )}
        <Card>
          <h2 className="mb-1 font-medium">Analytics</h2>
          <p className="text-sm text-ink-500">Posts per week, top tags, engagement — coming soon.</p>
        </Card>
      </div>
    </div>
  );
}
