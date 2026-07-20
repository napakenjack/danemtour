import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTours } from '@/features/tours/api/useTours';
import { TourCard } from '@/features/tours/ui/TourCard';
import { TourCardSkeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';

export function FeaturedTours() {
  const { data: tours, isLoading, isError, refetch } = useTours();
  const featured = tours?.slice(0, 6);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="content-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Направления"
            title="Популярные туры этого сезона"
            description="Часть направлений — с фотографиями-заглушками, финальные фото пришлём вместе с наполнением."
          />
          <Link to="/tours" className="hidden shrink-0 sm:block">
            <Button variant="outline">
              Все туры
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <TourCardSkeleton key={i} />)}

          {!isLoading && isError && (
            <div className="sm:col-span-2 lg:col-span-3">
              <ErrorState onRetry={() => refetch()} />
            </div>
          )}

          {!isLoading && !isError && featured?.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState title="Туры скоро появятся" description="Мы уже наполняем каталог направлениями." />
            </div>
          )}

          {!isLoading &&
            !isError &&
            featured?.map((tour, i) => <TourCard key={tour.id} tour={tour} index={i} />)}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link to="/tours" className="w-full">
            <Button variant="outline" className="w-full">
              Все туры
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
