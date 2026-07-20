import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        brand: 'bg-brand-100 text-brand-700',
        sunset: 'bg-sunset-100 text-sunset-700',
        neutral: 'bg-ink-100 text-ink-600',
        outline: 'border border-white/40 text-white backdrop-blur-sm bg-white/10',
      },
    },
    defaultVariants: { variant: 'brand' },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
