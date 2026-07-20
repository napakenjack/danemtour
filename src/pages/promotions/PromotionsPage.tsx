import { Flame } from 'lucide-react';
import { useTours } from '@/features/tours/api/useTours';
import { TourCard } from '@/features/tours/ui/TourCard';
import { TourCardSkeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';
import { whatsappLink } from '@/shared/config/site';

export function PromotionsPage() {
  const { data: tours, isLoading, isError, refetch } = useTours();
  const hotTours = tours?.filter((t) => t.is_hot);

  return (
    <>
      <PageHeader
        eyebrow="Акции"
        title="Горящие туры и спецпредложения"
        description="Ограниченные по времени предложения — цены и даты уточняйте, они меняются быстро."
      />

      <section className="content-container py-14 sm:py-20">
        <Reveal>
          <div className="mb-10 flex flex-col items-start gap-4 rounded-3xl bg-sunset-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sunset-500 text-white">
                <Flame size={20} />
              </span>
              <div>
                <p className="font-medium text-ink-900">Хотите узнавать об акциях первыми?</p>
                <p className="text-sm text-ink-500">Подпишитесь на рассылку горящих туров в WhatsApp.</p>
              </div>
            </div>
            <a
              href={whatsappLink('Здравствуйте! Хочу подписаться на горящие туры.')}
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
            >
              <Button variant="sunset">Подписаться</Button>
            </a>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <TourCardSkeleton key={i} />)}

          {!isLoading && isError && (
            <div className="sm:col-span-2 lg:col-span-3">
              <ErrorState onRetry={() => refetch()} />
            </div>
          )}

          {!isLoading && !isError && hotTours?.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="Сейчас горящих туров нет"
                description="Но мы обновляем список каждую неделю — загляните позже или подпишитесь на рассылку."
              />
            </div>
          )}

          {!isLoading &&
            !isError &&
            hotTours?.map((tour, i) => <TourCard key={tour.id} tour={tour} index={i} />)}
        </div>
      </section>
    </>
  );
}

export default PromotionsPage;
