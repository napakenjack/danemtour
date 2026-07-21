import type { ReactNode } from 'react';
import { Reveal } from '@/shared/ui/Reveal';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-transparent py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div className="content-container relative">
        <Reveal>
          <span className="eyebrow mb-3">{eyebrow}</span>
          <h1 className="max-w-2xl text-4xl leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-xl text-lg text-ink-500">{description}</p>}
        </Reveal>
      </div>
    </section>
  );
}
