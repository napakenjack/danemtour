import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, Heart } from 'lucide-react';
import type { Tour } from '@/shared/types/database.types';
import { Badge } from '@/shared/ui/Badge';
import { StarRating } from '@/shared/ui/StarRating';
import { formatDuration, formatPrice, segmentLabels } from '@/shared/lib/format';
import { Reveal } from '@/shared/ui/Reveal';
import { cn } from '@/shared/lib/cn';
import { useAuth } from '@/app/auth/AuthContext';
import { useFavoriteIds, useToggleFavorite } from '@/features/favorites/api/useFavorites';

export function TourCard({ tour, index = 0 }: { tour: Tour; index?: number }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: favoriteIds } = useFavoriteIds();
  const { mutate: toggleFavorite, isPending: isTogglingFavorite } = useToggleFavorite();
  const isFavorite = favoriteIds?.has(tour.id) ?? false;

  const handleToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleFavorite({ tourId: tour.id, isFavorite });
  };

  return (
    <Reveal delay={Math.min(index, 4) * 0.06} className="h-full">
      <Link
        to={`/tours/${tour.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-float"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
          {tour.image_url && (
            <img
              src={tour.image_url}
              alt={tour.title}
              loading="lazy"
              width={640}
              height={800}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/5 to-transparent" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {tour.is_hot && <Badge variant="sunset">Горящий тур</Badge>}
            <Badge variant="outline">{segmentLabels[tour.segment] ?? tour.segment}</Badge>
          </div>

          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              aria-pressed={isFavorite}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 disabled:opacity-60',
                isFavorite
                  ? 'bg-white text-sunset-500'
                  : 'bg-white/15 text-white hover:bg-white hover:text-sunset-500'
              )}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-ink-950">
              <ArrowUpRight size={18} />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">{tour.country}</p>
              <h3 className="mt-1 text-lg leading-snug text-white">{tour.title}</h3>
            </div>
            {tour.rating && <StarRating rating={tour.rating} className="shrink-0" />}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-1.5 text-sm text-ink-500">
            <CalendarDays size={15} />
            {formatDuration(tour.duration_days)}
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-ink-400">от</p>
            <p className="text-base font-bold text-ink-950">{formatPrice(tour.price_from, tour.currency)}</p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
