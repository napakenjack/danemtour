import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export function NotFoundPage() {
  return (
    <div className="content-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Compass size={28} />
      </span>
      <p className="mt-6 font-display text-6xl text-brand-500">404</p>
      <h1 className="mt-2 text-2xl text-ink-950">Такого маршрута не существует</h1>
      <p className="mt-2 max-w-sm text-ink-500">
        Страница не найдена. Возможно, ссылка устарела — но у нас точно есть тур, который вам понравится.
      </p>
      <Link to="/" className="mt-8">
        <Button>На главную</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
