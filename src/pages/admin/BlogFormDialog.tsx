import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/shared/api/supabase';
import { Dialog } from '@/shared/ui/Dialog';
import { FieldWrapper, Input, Textarea } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';
import type { BlogPost } from '@/shared/types/database.types';

const blogFormSchema = z.object({
  title: z.string().trim().min(2, 'Введите заголовок'),
  slug: z
    .string()
    .trim()
    .min(2, 'Введите slug')
    .regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  excerpt: z.string().trim().min(10, 'Введите краткое описание'),
  content: z.string().trim().min(20, 'Введите текст статьи'),
  coverImageUrl: z.string().trim().url('Введите корректный URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

const EMPTY_VALUES: BlogFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  isPublished: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface BlogFormDialogProps {
  open: boolean;
  onClose: () => void;
  post?: BlogPost | null;
}

export function BlogFormDialog({ open, onClose, post }: BlogFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!post;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({ resolver: zodResolver(blogFormSchema) });

  useEffect(() => {
    if (!open) return;
    reset(
      post
        ? {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImageUrl: post.cover_image_url ?? '',
            isPublished: post.is_published,
          }
        : EMPTY_VALUES
    );
  }, [open, post, reset]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (values: BlogFormValues) => {
      const payload = {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        content: values.content,
        cover_image_url: values.coverImageUrl || null,
        is_published: values.isPublished,
      };

      if (isEdit && post) {
        const { error: updateError } = await supabase.from('blog_posts').update(payload).eq('id', post.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('blog_posts').insert(payload);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? 'Редактировать статью' : 'Новая статья'}>
      <form onSubmit={handleSubmit((values) => mutate(values))} className="space-y-4">
        <FieldWrapper label="Заголовок" htmlFor="blog-title" error={errors.title?.message}>
          <Input id="blog-title" hasError={!!errors.title} {...register('title')} />
        </FieldWrapper>

        <FieldWrapper label="Slug (URL)" htmlFor="blog-slug" error={errors.slug?.message}>
          <div className="flex gap-2">
            <Input id="blog-slug" hasError={!!errors.slug} {...register('slug')} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setValue('slug', slugify(watch('title') || ''), { shouldValidate: true })}
            >
              Из заголовка
            </Button>
          </div>
        </FieldWrapper>

        <FieldWrapper label="Краткое описание" htmlFor="blog-excerpt" error={errors.excerpt?.message}>
          <Textarea id="blog-excerpt" hasError={!!errors.excerpt} {...register('excerpt')} />
        </FieldWrapper>

        <FieldWrapper label="Текст статьи" htmlFor="blog-content" error={errors.content?.message}>
          <Textarea id="blog-content" rows={8} hasError={!!errors.content} {...register('content')} />
        </FieldWrapper>

        <FieldWrapper label="Ссылка на обложку" htmlFor="blog-cover" error={errors.coverImageUrl?.message}>
          <Input
            id="blog-cover"
            placeholder="https://…"
            hasError={!!errors.coverImageUrl}
            {...register('coverImageUrl')}
          />
        </FieldWrapper>

        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" {...register('isPublished')} />
          Опубликована
        </label>

        {error && <p className="text-sm text-sunset-600">Не получилось сохранить. Попробуйте ещё раз.</p>}

        <Button type="submit" isLoading={isPending} className="w-full">
          {isEdit ? 'Сохранить изменения' : 'Создать статью'}
        </Button>
      </form>
    </Dialog>
  );
}
