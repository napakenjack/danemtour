import { useMemo, useState } from 'react';
import { useTours } from '@/features/tours/api/useTours';
import { TourCard } from '@/features/tours/ui/TourCard';
import { TourCardSkeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { cn } from '@/shared/lib/cn';
import { segmentLabels } from '@/shared/lib/format';

const FILTERS = [
  { value: 'all', label: 'Все туры' },
  { value: 'economy', label: segmentLabels.economy },
  { value: 'standard', label: segmentLabels.standard },
  { value: 'premium', label: segmentLabels.premium },
  { value: 'mice', label: segmentLabels.mice },
] as const;

export function ToursPage() {
  const { data: tours, isLoading, isError, refetch } = useTours();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('all');

  const filtered = useMemo(() => {
    if (!tours) return [];
    return filter === 'all' ? tours : tours.filter((t) => t.segment === filter);
  }, [tours, filter]);

  return (
    <>
      <PageHeader
        eyebrow="Каталог"
        title="Куда полетим?"
        description="Подобранные направления на 2026 год — от горящих туров до премиального отдыха и MICE."
      />

      <section className="content-container py-14 sm:py-20">
        <div className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                filter === f.value
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-600'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <TourCardSkeleton key={i} />)}

          {!isLoading && isError && (
            <div className="sm:col-span-2 lg:col-span-3">
              <ErrorState onRetry={() => refetch()} />
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="По этому фильтру туров пока нет"
                description="Попробуйте выбрать другую категорию или напишите нам — подберём индивидуально."
              />
            </div>
          )}

          {!isLoading &&
            !isError &&
            filtered.map((tour, i) => <TourCard key={tour.id} tour={tour} index={i} />)}
        </div>
      </section>
    </>
  );
}

export default ToursPage;
