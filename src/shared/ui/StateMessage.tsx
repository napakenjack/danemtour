import type { ReactNode } from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface StateMessageProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

function StateMessage({ icon, title, description, action }: StateMessageProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
      {icon}
      <p className="font-display text-xl text-ink-900">{title}</p>
      {description && <p className="max-w-sm text-ink-500">{description}</p>}
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateMessage
      icon={<AlertCircle className="h-10 w-10 text-sunset-500" />}
      title="Не получилось загрузить данные"
      description="Проверьте соединение и попробуйте ещё раз — мы уже разбираемся."
      action={onRetry ? { label: 'Повторить', onClick: onRetry } : undefined}
    />
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <StateMessage icon={<Inbox className="h-10 w-10 text-ink-300" />} title={title} description={description} />
  );
}
