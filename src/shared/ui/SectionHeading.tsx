import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Reveal } from '@/shared/ui/Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-ink-500">{description}</p>
      )}
    </Reveal>
  );
}
