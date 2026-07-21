import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/auth/AuthContext';

function GuardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-brand-500" />
    </div>
  );
}

export function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <GuardLoading />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}

export function RequireAdmin() {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <GuardLoading />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
