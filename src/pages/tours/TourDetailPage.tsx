import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, MapPin } from 'lucide-react';
import { useTour } from '@/features/tours/api/useTours';
import { LeadForm } from '@/features/leads/ui/LeadForm';
import { Badge } from '@/shared/ui/Badge';
import { StarRating } from '@/shared/ui/StarRating';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState } from '@/shared/ui/StateMessage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { formatDuration, formatPrice, segmentLabels } from '@/shared/lib/format';

export function TourDetailPage() {
  const { slug } = useParams();
  const { data: tour, isLoading, isError, error, refetch } = useTour(slug);

  if (isLoading) {
    return (
      <div className="content-container py-16">
        <Skeleton className="aspect-[16/7] w-full" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    const isNotFound = (error as { code?: string })?.code === 'PGRST116';
    if (isNotFound) return <NotFoundPage />;
    return (
      <div className="content-container py-16">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (!tour) return <NotFoundPage />;

  return (
    <article className="pb-20">
      <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[16/6]">
        {tour.image_url && (
          <img src={tour.image_url} alt={tour.title} className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
        <div className="content-container absolute inset-x-0 bottom-6 text-white">
          <Link
            to="/tours"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft size={16} />
            Все туры
          </Link>
          <div className="flex flex-wrap gap-2">
            {tour.is_hot && <Badge variant="sunset">Горящий тур</Badge>}
            <Badge variant="outline">{segmentLabels[tour.segment] ?? tour.segment}</Badge>
          </div>
          <h1 className="mt-3 text-3xl tracking-tight sm:text-5xl">{tour.title}</h1>
        </div>
      </div>

      <div className="content-container mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-5 text-ink-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-brand-500" />
              {tour.country}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={16} className="text-brand-500" />
              {formatDuration(tour.duration_days)}
            </span>
            {tour.rating && <StarRating rating={tour.rating} />}
          </div>

          <p className="text-lg leading-relaxed text-ink-600">{tour.description}</p>

          {tour.highlights.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl">Что входит</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-ink-600">
                    <Check size={18} className="mt-0.5 shrink-0 text-brand-500" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <p className="text-sm text-ink-400">Стоимость от</p>
            <p className="mb-6 text-3xl font-bold text-ink-950">
              {formatPrice(tour.price_from, tour.currency)}
            </p>
            <h3 className="mb-4 text-xl text-ink-950">Оставить заявку</h3>
            <LeadForm tourId={tour.id} tourTitle={tour.title} source="tour_detail" compact />
          </div>
        </div>
      </div>
    </article>
  );
}

export default TourDetailPage;
