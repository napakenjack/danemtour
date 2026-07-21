import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api/supabase';
import { Dialog } from '@/shared/ui/Dialog';
import { FieldWrapper, Input, Textarea } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';
import { segmentLabels } from '@/shared/lib/format';
import type { Tour } from '@/shared/types/database.types';

const tourFormSchema = z.object({
  title: z.string().trim().min(2, 'Введите название'),
  slug: z
    .string()
    .trim()
    .min(2, 'Введите slug')
    .regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  country: z.string().trim().min(2, 'Введите страну'),
  description: z.string().trim().min(10, 'Введите описание (от 10 символов)'),
  highlights: z.string().trim().optional(),
  priceFrom: z.coerce.number().positive('Цена должна быть больше 0'),
  currency: z.string().trim().min(1, 'Укажите валюту'),
  durationDays: z.coerce.number().int().positive('Введите число дней'),
  imageUrl: z.string().trim().url('Введите корректный URL').optional().or(z.literal('')),
  segment: z.enum(['economy', 'standard', 'premium', 'mice']),
  isHot: z.boolean(),
  rating: z.preprocess(
    (value) => (value === '' || value === undefined || value === null ? undefined : value),
    z.coerce.number().min(0).max(5).optional()
  ),
});

// z.coerce/z.preprocess полей делают input-тип (то, что реально лежит в форме до
// валидации) отличным от output-типа (то, что уходит в мутацию после парсинга) —
// поэтому форма типизируется input-типом, а колбэк submit получает output.
type TourFormInput = z.input<typeof tourFormSchema>;
type TourFormValues = z.output<typeof tourFormSchema>;

const EMPTY_VALUES: TourFormInput = {
  title: '',
  slug: '',
  country: '',
  description: '',
  highlights: '',
  priceFrom: 0,
  currency: 'KZT',
  durationDays: 7,
  imageUrl: '',
  segment: 'economy',
  isHot: false,
  rating: undefined,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface TourFormDialogProps {
  open: boolean;
  onClose: () => void;
  tour?: Tour | null;
}

export function TourFormDialog({ open, onClose, tour }: TourFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!tour;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TourFormInput, unknown, TourFormValues>({ resolver: zodResolver(tourFormSchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      tour
        ? {
            title: tour.title,
            slug: tour.slug,
            country: tour.country,
            description: tour.description,
            highlights: tour.highlights.join('\n'),
            priceFrom: tour.price_from,
            currency: tour.currency,
            durationDays: tour.duration_days,
            imageUrl: tour.image_url ?? '',
            segment: tour.segment,
            isHot: tour.is_hot,
            rating: tour.rating ?? undefined,
          }
        : EMPTY_VALUES
    );
  }, [open, tour, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: TourFormValues) => {
      const payload = {
        title: values.title,
        slug: values.slug,
        country: values.country,
        description: values.description,
        highlights: values.highlights
          ? values.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
          : [],
        price_from: values.priceFrom,
        currency: values.currency,
        duration_days: values.durationDays,
        image_url: values.imageUrl || null,
        segment: values.segment,
        is_hot: values.isHot,
        rating: values.rating ?? null,
      };

      if (isEdit && tour) {
        const { error: updateError } = await supabase.from('tours').update(payload).eq('id', tour.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('tours').insert(payload);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? 'Редактировать тур' : 'Новый тур'}>
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
        <FieldWrapper label="Название" htmlFor="tour-title" error={errors.title?.message}>
          <Input id="tour-title" hasError={!!errors.title} {...register('title')} />
        </FieldWrapper>

        <FieldWrapper label="Slug (URL)" htmlFor="tour-slug" error={errors.slug?.message}>
          <div className="flex gap-2">
            <Input id="tour-slug" hasError={!!errors.slug} {...register('slug')} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('slug', slugify(watch('title') || ''), { shouldValidate: true })}
            >
              Из названия
            </Button>
          </div>
        </FieldWrapper>

        <FieldWrapper label="Страна" htmlFor="tour-country" error={errors.country?.message}>
          <Input id="tour-country" hasError={!!errors.country} {...register('country')} />
        </FieldWrapper>

        <FieldWrapper label="Описание" htmlFor="tour-description" error={errors.description?.message}>
          <Textarea id="tour-description" hasError={!!errors.description} {...register('description')} />
        </FieldWrapper>

        <FieldWrapper
          label="Особенности (по одной на строку)"
          htmlFor="tour-highlights"
          error={errors.highlights?.message}
        >
          <Textarea id="tour-highlights" rows={4} {...register('highlights')} />
        </FieldWrapper>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Цена от" htmlFor="tour-price" error={errors.priceFrom?.message}>
            <Input id="tour-price" type="number" hasError={!!errors.priceFrom} {...register('priceFrom')} />
          </FieldWrapper>
          <FieldWrapper label="Валюта" htmlFor="tour-currency" error={errors.currency?.message}>
            <Input id="tour-currency" hasError={!!errors.currency} {...register('currency')} />
          </FieldWrapper>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Дней" htmlFor="tour-duration" error={errors.durationDays?.message}>
            <Input
              id="tour-duration"
              type="number"
              hasError={!!errors.durationDays}
              {...register('durationDays')}
            />
          </FieldWrapper>
          <FieldWrapper label="Рейтинг (0–5)" htmlFor="tour-rating" error={errors.rating?.message}>
            <Input id="tour-rating" type="number" step="0.1" min={0} max={5} {...register('rating')} />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Ссылка на фото" htmlFor="tour-image" error={errors.imageUrl?.message}>
          <Input
            id="tour-image"
            placeholder="https://…"
            hasError={!!errors.imageUrl}
            {...register('imageUrl')}
          />
        </FieldWrapper>

        <FieldWrapper label="Сегмент" htmlFor="tour-segment" error={errors.segment?.message}>
          <select
            id="tour-segment"
            className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            {...register('segment')}
          >
            {Object.entries(segmentLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" {...register('isHot')} />
          Горящий тур
        </label>

        {error && <p className="text-sm text-sunset-600">Не получилось сохранить. Попробуйте ещё раз.</p>}

        <Button type="submit" isLoading={isPending} className="w-full">
          {isEdit ? 'Сохранить изменения' : 'Создать тур'}
        </Button>
      </form>
    </Dialog>
  );
}
