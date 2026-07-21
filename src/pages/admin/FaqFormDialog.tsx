import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api/supabase';
import { Dialog } from '@/shared/ui/Dialog';
import { FieldWrapper, Input, Textarea } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';
import type { FaqItem } from '@/shared/types/database.types';

const faqFormSchema = z.object({
  question: z.string().trim().min(3, 'Введите вопрос'),
  answer: z.string().trim().min(3, 'Введите ответ'),
  sortOrder: z.coerce.number().int(),
});

type FaqFormInput = z.input<typeof faqFormSchema>;
type FaqFormValues = z.output<typeof faqFormSchema>;

interface FaqFormDialogProps {
  open: boolean;
  onClose: () => void;
  item?: FaqItem | null;
}

export function FaqFormDialog({ open, onClose, item }: FaqFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!item;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormInput, unknown, FaqFormValues>({ resolver: zodResolver(faqFormSchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      item
        ? { question: item.question, answer: item.answer, sortOrder: item.sort_order }
        : { question: '', answer: '', sortOrder: 0 }
    );
  }, [open, item, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: FaqFormValues) => {
      const payload = { question: values.question, answer: values.answer, sort_order: values.sortOrder };
      if (isEdit && item) {
        const { error: updateError } = await supabase.from('faq').update(payload).eq('id', item.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('faq').insert(payload);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? 'Редактировать вопрос' : 'Новый вопрос'}>
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
        <FieldWrapper label="Вопрос" htmlFor="faq-question" error={errors.question?.message}>
          <Input id="faq-question" hasError={!!errors.question} {...register('question')} />
        </FieldWrapper>

        <FieldWrapper label="Ответ" htmlFor="faq-answer" error={errors.answer?.message}>
          <Textarea id="faq-answer" hasError={!!errors.answer} {...register('answer')} />
        </FieldWrapper>

        <FieldWrapper label="Порядок сортировки" htmlFor="faq-sort" error={errors.sortOrder?.message}>
          <Input id="faq-sort" type="number" hasError={!!errors.sortOrder} {...register('sortOrder')} />
        </FieldWrapper>

        {error && <p className="text-sm text-sunset-600">Не получилось сохранить. Попробуйте ещё раз.</p>}

        <Button type="submit" isLoading={isPending} className="w-full">
          {isEdit ? 'Сохранить изменения' : 'Добавить'}
        </Button>
      </form>
    </Dialog>
  );
}
