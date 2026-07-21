import { NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/app/auth/AuthContext';
import { cn } from '@/shared/lib/cn';

const TABS = [
  { to: '/account', label: 'Профиль', end: true },
  { to: '/account/requests', label: 'Мои заявки', end: false },
  { to: '/account/favorites', label: 'Избранное', end: false },
] as const;

export function AccountLayout() {
  const { profile, signOut } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="Личный кабинет"
        title={profile?.full_name ? `Привет, ${profile.full_name}!` : 'Личный кабинет'}
      />

      <section className="content-container py-10 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-4">
          <nav className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100'
                  )
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <Button variant="ghost" size="sm" onClick={() => void signOut()}>
            <LogOut size={16} />
            Выйти
          </Button>
        </div>

        <div className="pt-8">
          <Outlet />
        </div>
      </section>
    </>
  );
}

export default AccountLayout;
