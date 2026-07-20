import { cn } from '@/shared/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-ink-100', className)} />;
}

export function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}
