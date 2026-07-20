import { Compass } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function Logo({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-display', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white">
        <Compass size={18} strokeWidth={2.5} />
      </span>
      <span className={cn('text-lg font-bold tracking-tight', dark ? 'text-white' : 'text-ink-950')}>
        danem <span className="text-brand-500">tour</span>
      </span>
    </span>
  );
}
