import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { FaqFormDialog } from '@/pages/admin/FaqFormDialog';
import type { FaqItem } from '@/shared/types/database.types';

export function AdminFaqPage() {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: items,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin-faq'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faq').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { mutate: deleteItem } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faq').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faq'] });
      queryClient.invalidateQueries({ queryKey: ['faq'] });
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-950">FAQ</h1>
          <p className="mt-1 text-sm text-ink-500">Вопросы и ответы на странице FAQ и на главной.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          Добавить вопрос
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && items?.length === 0 && (
          <EmptyState title="Вопросов пока нет" description="Нажмите «Добавить вопрос», чтобы создать первый." />
        )}

        {!isLoading &&
          !isError &&
          items?.map((item) => (
            <div key={item.id} className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink-900">{item.question}</p>
                  <p className="mt-1 text-sm text-ink-600">{item.answer}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label="Редактировать"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Удалить вопрос?')) deleteItem(item.id);
                    }}
                    aria-label="Удалить"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sunset-500 transition-colors hover:bg-sunset-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <FaqFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} item={editingItem} />
    </div>
  );
}

export default AdminFaqPage;
