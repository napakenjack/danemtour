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
      {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
      <h2 className="text-[2rem] leading-[1.08] tracking-tight sm:text-[2.5rem]">{title}</h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-ink-500">{description}</p>
      )}
    </Reveal>
  );
}
