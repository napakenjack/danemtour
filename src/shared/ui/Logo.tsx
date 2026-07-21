import { useState } from 'react';
import { Compass } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

/**
 * Кастомный логотип — положить файл в public/images/ под именем ниже, код трогать не нужно
 * (см. docs/IMAGES.md). Пока файла нет, <img> отдаёт 404 и мы откатываемся на плейсхолдер
 * (иконка компаса + текст) через onError — тот же паттерн, что и у hero-фото.
 */
const LOGO_SRC = {
  light: '/images/logo.svg',
  dark: '/images/logo-dark-bg.svg',
};

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        src={dark ? LOGO_SRC.dark : LOGO_SRC.light}
        alt="danem tour"
        className={cn('h-9 w-auto', className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2.5 font-display', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white">
        <Compass size={18} strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          'text-lg font-extrabold uppercase tracking-tight',
          dark ? 'text-white' : 'text-ink-950'
        )}
      >
        danem <span className="text-brand-400">tour</span>
      </span>
    </span>
  );
}
