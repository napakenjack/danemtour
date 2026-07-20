import { type FormEvent, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSubscribe } from '@/features/newsletter/api/useSubscribe';
import { Input } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const { mutate, isPending, isSuccess, isError } = useSubscribe();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    mutate(email, { onSuccess: () => setEmail('') });
  };

  if (isSuccess) {
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <CheckCircle2 size={18} className="text-brand-300" />
        Вы подписаны на рассылку
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        required
        placeholder="Ваш e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-white/15 bg-white/10 text-white placeholder:text-ink-300 focus:ring-white/10"
      />
      <Button type="submit" variant="primary" size="md" isLoading={isPending} className="shrink-0">
        Подписаться
      </Button>
      {isError && <p className="text-xs text-sunset-300">Не получилось подписать, попробуйте ещё раз.</p>}
    </form>
  );
}
