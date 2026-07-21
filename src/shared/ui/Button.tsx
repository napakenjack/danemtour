import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'bg-ink-950 text-white shadow-soft hover:bg-brand-600 hover:scale-[1.02] active:scale-[0.98]',
        light:
          'bg-white text-ink-950 shadow-soft hover:bg-ink-100 hover:scale-[1.02] active:scale-[0.98]',
        sunset:
          'bg-sunset-500 text-white shadow-soft hover:bg-sunset-600 hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-ink-200 text-ink-800 bg-white hover:border-ink-950 hover:text-ink-950 hover:scale-[1.02] active:scale-[0.98]',
        outlineLight:
          'border border-white/35 text-white bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/60 hover:scale-[1.02] active:scale-[0.98]',
        ghost: 'text-ink-700 hover:bg-ink-100',
        whatsapp:
          'bg-[#25D366] text-white shadow-soft hover:bg-[#1ebe5a] hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
