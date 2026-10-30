import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Card from '../components/ui/Card';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../routes';

const FIELDS = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
];

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function handleSubmit(values) {
    setError('');
    try {
      await auth.login(values);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <Card>
        <AuthForm fields={FIELDS} submitLabel="Log in" onSubmit={handleSubmit} error={error} />
      </Card>
    </div>
  );
}
