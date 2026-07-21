import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { useReviews } from '@/features/reviews/api/useReviews';
import { useTours } from '@/features/tours/api/useTours';
import { StarRating } from '@/shared/ui/StarRating';
import { ReviewCardSkeleton, Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';

const CARD_ROTATIONS = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6'];
const AVATAR_TONES = [
  'bg-brand-100 text-brand-700',
  'bg-sunset-100 text-sunset-700',
  'bg-ink-100 text-ink-700',
  'bg-brand-50 text-brand-600',
];

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function ReviewsPreview() {
  const { data: reviews, isLoading, isError, refetch } = useReviews(6);
  const { data: tours } = useTours();
  const photos = tours?.slice(0, 4).map((t) => t.image_url).filter(Boolean) as string[] | undefined;

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="content-container-wide">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow mb-3 justify-center">Отзывы</span>
          <h2 className="text-[2rem] leading-[1.1] tracking-tight sm:text-[2.5rem]">
            Как наши туристы проводят отпуск с danem tour
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-500">
            <div className="flex -space-x-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={15} className="fill-sunset-400 text-sunset-400" />
              ))}
            </div>
            <span>4.9 средний рейтинг по отзывам туристов</span>
          </div>
        </Reveal>

        <div className="mt-14 mb-16 hidden justify-center sm:flex">
          {(photos ?? Array.from({ length: 4 })).map((src, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              className={`relative -ml-8 h-56 w-40 shrink-0 overflow-hidden rounded-3xl border-4 border-white shadow-soft transition-transform duration-300 hover:z-10 hover:-translate-y-2 first:ml-0 ${CARD_ROTATIONS[i % CARD_ROTATIONS.length]}`}
            >
              {src ? (
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <Skeleton className="h-full w-full rounded-none" />
              )}
            </Reveal>
          ))}
        </div>

        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && reviews?.length === 0 && (
          <EmptyState title="Пока нет отзывов" description="Будем рады первому впечатлению о поездке." />
        )}

        <div className="no-scrollbar snap-x-mandatory flex gap-5 overflow-x-auto pb-2">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[300px] shrink-0">
                <ReviewCardSkeleton />
              </div>
            ))}

          {!isLoading &&
            !isError &&
            reviews?.map((review, i) => (
              <Reveal key={review.id} delay={i * 0.06} className="snap-center-item w-[300px] shrink-0">
                <div className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
                    >
                      {initials(review.author_name)}
                    </span>
                    <div>
                      <p className="font-medium text-ink-900">{review.author_name}</p>
                      <StarRating rating={review.rating} />
                    </div>
                    <Quote className="ml-auto h-6 w-6 shrink-0 text-ink-200" />
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">{review.text}</p>
                </div>
              </Reveal>
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/reviews">
            <Button variant="outline">
              Все отзывы
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
