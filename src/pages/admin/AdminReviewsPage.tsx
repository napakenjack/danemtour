import { Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { StarRating } from '@/shared/ui/StarRating';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';

export function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const { mutate: togglePublished } = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { error } = await supabase.from('reviews').update({ is_published: isPublished }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const { mutate: deleteReview } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-950">Отзывы</h1>
      <p className="mt-1 text-sm text-ink-500">Модерация — публикация и удаление отзывов с сайта.</p>

      <div className="mt-6 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}

        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && reviews?.length === 0 && <EmptyState title="Отзывов пока нет" />}

        {!isLoading &&
          !isError &&
          reviews?.map((review) => (
            <div key={review.id} className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-900">{review.author_name}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-2 max-w-xl text-sm text-ink-600">{review.text}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-ink-600">
                    <input
                      type="checkbox"
                      checked={review.is_published}
                      onChange={(e) => togglePublished({ id: review.id, isPublished: e.target.checked })}
                    />
                    Опубликован
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Удалить отзыв?')) deleteReview(review.id);
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
    </div>
  );
}

export default AdminReviewsPage;
