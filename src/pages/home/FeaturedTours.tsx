import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTours } from '@/features/tours/api/useTours';
import { TourCard } from '@/features/tours/ui/TourCard';
import { TourCardSkeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';

export function FeaturedTours() {
  const { data: tours, isLoading, isError, refetch } = useTours();
  const featured = tours?.slice(0, 8);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="content-container-wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Направления"
            title="Ваше путешествие к идеальному месту начинается здесь"
            description="Часть направлений — с фотографиями-заглушками, финальные фото пришлём вместе с наполнением."
          />

          <div className="flex shrink-0 items-center gap-3">
            <Link to="/tours">
              <Button variant="outline">Все туры</Button>
            </Link>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Предыдущие туры"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Следующие туры"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-ink-950 hover:text-ink-950"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {!isLoading && isError && (
          <div className="mt-12">
            <ErrorState onRetry={() => refetch()} />
          </div>
        )}

        {!isLoading && !isError && featured?.length === 0 && (
          <div className="mt-12">
            <EmptyState title="Туры скоро появятся" description="Мы уже наполняем каталог направлениями." />
          </div>
        )}

        <div
          ref={scrollerRef}
          className="no-scrollbar snap-x-mandatory mt-8 flex gap-5 overflow-x-auto px-1 pt-4 pb-8"
        >
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[78vw] shrink-0 sm:w-[320px]">
                <TourCardSkeleton />
              </div>
            ))}

          {!isLoading &&
            !isError &&
            featured?.map((tour, i) => (
              <div key={tour.id} className="snap-center-item w-[78vw] shrink-0 sm:w-[320px]">
                <TourCard tour={tour} index={i} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
