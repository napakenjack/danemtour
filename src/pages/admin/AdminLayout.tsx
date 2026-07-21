import { NavLink, Outlet } from 'react-router-dom';
import { HelpCircle, Inbox, MapPinned, MessageSquareText, Newspaper } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

const NAV = [
  { to: '/admin/leads', label: 'Заявки', icon: Inbox },
  { to: '/admin/tours', label: 'Туры', icon: MapPinned },
  { to: '/admin/reviews', label: 'Отзывы', icon: MessageSquareText },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/blog', label: 'Блог', icon: Newspaper },
] as const;

export function AdminLayout() {
  return (
    <div className="content-container-wide flex flex-col gap-8 py-10 sm:py-14 lg:flex-row">
      <aside className="lg:w-56 lg:shrink-0">
        <p className="eyebrow mb-4">CRM</p>
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors lg:rounded-2xl',
                  isActive ? 'bg-ink-950 text-white' : 'text-ink-600 hover:bg-ink-100'
                )
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
