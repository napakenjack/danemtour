import { useFavoriteTours } from '@/features/favorites/api/useFavorites';
import { TourCard } from '@/features/tours/ui/TourCard';
import { TourCardSkeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';

export function AccountFavoritesPage() {
  const { data: tours, isLoading, isError, refetch } = useFavoriteTours();

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <TourCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (!tours || tours.length === 0) {
    return (
      <EmptyState
        title="Пока нет избранных туров"
        description="Нажмите на сердечко на карточке тура, чтобы сохранить его сюда."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour, i) => (
        <TourCard key={tour.id} tour={tour} index={i} />
      ))}
    </div>
  );
}

export default AccountFavoritesPage;
