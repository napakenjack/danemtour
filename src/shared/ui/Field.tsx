import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

const fieldBaseClass =
  'w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100';

interface FieldWrapperProps {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, htmlFor, children }: FieldWrapperProps) {
  return (
    <div className="text-left">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-sunset-600">{error}</p>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBaseClass, hasError && 'border-sunset-400 focus:ring-sunset-100', className)}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }
>(({ className, hasError, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBaseClass, 'min-h-32 resize-y', hasError && 'border-sunset-400 focus:ring-sunset-100', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
