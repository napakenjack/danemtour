import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface StarRatingProps {
  rating: number;
  className?: string;
}

export function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`Рейтинг ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(rating) ? 'fill-sunset-400 text-sunset-400' : 'fill-ink-200 text-ink-200'}
        />
      ))}
    </div>
  );
}
