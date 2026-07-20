import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { leadSchema, type LeadFormValues } from '@/features/leads/model/schema';
import { useCreateLead } from '@/features/leads/api/useCreateLead';
import { FieldWrapper, Input, Textarea } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';

interface LeadFormProps {
  tourId?: string;
  tourTitle?: string;
  source?: string;
  title?: string;
  description?: string;
  compact?: boolean;
}

export function LeadForm({
  tourId,
  tourTitle,
  source = 'website',
  title = 'Оставьте заявку — подберём тур',
  description = 'Перезвоним или напишем в WhatsApp в течение рабочего дня.',
  compact = false,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({ resolver: zodResolver(leadSchema) });

  const { mutate, isPending, isSuccess, isError, reset: resetMutation } = useCreateLead();

  const onSubmit = (values: LeadFormValues) => {
    mutate(
      { ...values, tourId, tourTitle, source },
      {
        onSuccess: () => reset(),
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-500" />
        <p className="font-display text-xl text-ink-900">Заявка отправлена!</p>
        <p className="max-w-xs text-ink-500">
          Спасибо! Свяжемся с вами в ближайшее время, чтобы подобрать лучший вариант.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            resetMutation();
            reset({ name: '', phone: '', message: '' });
          }}
        >
          Отправить ещё одну заявку
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {!compact && (
        <div>
          <h3 className="text-xl font-display text-ink-950">{title}</h3>
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        </div>
      )}

      {tourTitle && (
        <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700">
          Направление: <span className="font-semibold">{tourTitle}</span>
        </p>
      )}

      <FieldWrapper label="Ваше имя" htmlFor="lead-name" error={errors.name?.message}>
        <Input
          id="lead-name"
          placeholder="Асель"
          hasError={!!errors.name}
          {...register('name')}
        />
      </FieldWrapper>

      <FieldWrapper label="Телефон" htmlFor="lead-phone" error={errors.phone?.message}>
        <Input
          id="lead-phone"
          type="tel"
          placeholder="+7 707 000 00 00"
          hasError={!!errors.phone}
          {...register('phone')}
        />
      </FieldWrapper>

      <FieldWrapper label="Комментарий (необязательно)" htmlFor="lead-message" error={errors.message?.message}>
        <Textarea
          id="lead-message"
          placeholder="Даты, направление, пожелания…"
          hasError={!!errors.message}
          {...register('message')}
        />
      </FieldWrapper>

      {isError && (
        <p className="text-sm text-sunset-600">
          Не получилось отправить заявку. Попробуйте ещё раз или напишите в WhatsApp.
        </p>
      )}

      <Button type="submit" isLoading={isPending} className="w-full">
        Оставить заявку
      </Button>

      <p className="text-center text-xs text-ink-400">
        Отправляя форму, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
}
