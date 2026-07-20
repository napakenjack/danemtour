import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';
import { useReviews } from '@/features/reviews/api/useReviews';
import { StarRating } from '@/shared/ui/StarRating';
import { ReviewCardSkeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';

export function ReviewsPreview() {
  const { data: reviews, isLoading, isError, refetch } = useReviews(3);

  return (
    <section className="content-container py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Отзывы" title="Что говорят наши туристы" />
        <Link to="/reviews" className="hidden shrink-0 sm:block">
          <Button variant="outline">
            Все отзывы
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)}

        {!isLoading && isError && (
          <div className="sm:col-span-2 lg:col-span-3">
            <ErrorState onRetry={() => refetch()} />
          </div>
        )}

        {!isLoading && !isError && reviews?.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState title="Пока нет отзывов" description="Будем рады первому впечатлению о поездке." />
          </div>
        )}

        {!isLoading &&
          !isError &&
          reviews?.map((review, i) => (
            <Reveal key={review.id} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6">
                <Quote className="mb-3 h-7 w-7 text-brand-200" />
                <p className="flex-1 text-sm leading-relaxed text-ink-600">{review.text}</p>
                <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
                  <p className="font-medium text-ink-900">{review.author_name}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
