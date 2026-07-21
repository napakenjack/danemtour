import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '@/app/auth/AuthContext';
import { supabase } from '@/shared/api/supabase';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import type { LeadStatus } from '@/shared/types/database.types';

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Новая',
  contacted: 'Связались',
  closed: 'Закрыта',
};

const STATUS_VARIANTS: Record<LeadStatus, 'brand' | 'sunset' | 'neutral'> = {
  new: 'brand',
  contacted: 'sunset',
  closed: 'neutral',
};

export function AccountRequestsPage() {
  const { user } = useAuth();

  const {
    data: leads,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-leads', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  if (!leads || leads.length === 0) {
    return (
      <EmptyState
        title="Заявок пока нет"
        description="Оставьте заявку на любой тур — она появится здесь."
      />
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div key={lead.id} className="rounded-2xl border border-ink-100 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg text-ink-900">
                {lead.tour_title ?? 'Индивидуальный запрос'}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                <CalendarDays size={14} />
                {new Date(lead.created_at).toLocaleDateString('ru-RU')}
              </p>
              {lead.message && <p className="mt-2 text-sm text-ink-600">{lead.message}</p>}
            </div>
            <Badge variant={STATUS_VARIANTS[lead.status]}>{STATUS_LABELS[lead.status]}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AccountRequestsPage;
