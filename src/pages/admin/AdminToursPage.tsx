import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTours } from '@/features/tours/api/useTours';
import { supabase } from '@/shared/api/supabase';
import { Button } from '@/shared/ui/Button';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { formatPrice, segmentLabels } from '@/shared/lib/format';
import { TourFormDialog } from '@/pages/admin/TourFormDialog';
import type { Tour } from '@/shared/types/database.types';

export function AdminToursPage() {
  const { data: tours, isLoading, isError, refetch } = useTours();
  const queryClient = useQueryClient();
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: deleteTour } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tours'] }),
  });

  const openCreate = () => {
    setEditingTour(null);
    setIsDialogOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setIsDialogOpen(true);
  };

  const handleDelete = (tour: Tour) => {
    if (window.confirm(`Удалить тур «${tour.title}»?`)) deleteTour(tour.id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-950">Туры</h1>
          <p className="mt-1 text-sm text-ink-500">Каталог направлений, отображается на сайте.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          Добавить тур
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white">
        {isLoading && (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-6">
            <ErrorState onRetry={() => refetch()} />
          </div>
        )}

        {!isLoading && !isError && tours?.length === 0 && (
          <div className="p-6">
            <EmptyState title="Туров пока нет" description="Нажмите «Добавить тур», чтобы создать первый." />
          </div>
        )}

        {!isLoading && !isError && tours && tours.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-5 py-3">Тур</th>
                  <th className="px-5 py-3">Страна</th>
                  <th className="px-5 py-3">Сегмент</th>
                  <th className="px-5 py-3">Цена от</th>
                  <th className="px-5 py-3">Горящий</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {tours.map((tour) => (
                  <tr key={tour.id}>
                    <td className="px-5 py-3 font-medium text-ink-900">{tour.title}</td>
                    <td className="px-5 py-3 text-ink-600">{tour.country}</td>
                    <td className="px-5 py-3 text-ink-600">{segmentLabels[tour.segment] ?? tour.segment}</td>
                    <td className="px-5 py-3 text-ink-600">{formatPrice(tour.price_from, tour.currency)}</td>
                    <td className="px-5 py-3 text-ink-600">{tour.is_hot ? 'Да' : '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(tour)}
                          aria-label="Редактировать"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tour)}
                          aria-label="Удалить"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sunset-500 transition-colors hover:bg-sunset-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TourFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} tour={editingTour} />
    </div>
  );
}

export default AdminToursPage;
