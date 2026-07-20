import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import type { Tour } from '@/shared/types/database.types';
import { Badge } from '@/shared/ui/Badge';
import { StarRating } from '@/shared/ui/StarRating';
import { formatDuration, formatPrice, segmentLabels } from '@/shared/lib/format';
import { Reveal } from '@/shared/ui/Reveal';

export function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  return (
    <Reveal delay={Math.min(index, 4) * 0.06}>
      <Link
        to={`/tours/${tour.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-100">
          {tour.image_url && (
            <img
              src={tour.image_url}
              alt={tour.title}
              loading="lazy"
              width={640}
              height={480}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {tour.is_hot && <Badge variant="sunset">Горящий тур</Badge>}
            <Badge variant="outline">{segmentLabels[tour.segment] ?? tour.segment}</Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>{tour.country}</span>
            {tour.rating && <StarRating rating={tour.rating} />}
          </div>

          <h3 className="text-xl leading-snug text-ink-950">{tour.title}</h3>

          <p className="line-clamp-2 flex-1 text-sm text-ink-500">{tour.description}</p>

          <div className="flex items-center gap-1.5 text-sm text-ink-500">
            <CalendarDays size={16} />
            {formatDuration(tour.duration_days)}
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-ink-100 pt-4">
            <div>
              <p className="text-xs text-ink-400">от</p>
              <p className="text-lg font-bold text-ink-950">{formatPrice(tour.price_from, tour.currency)}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
