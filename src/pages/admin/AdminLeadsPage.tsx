import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import type { LeadStatus } from '@/shared/types/database.types';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Новая' },
  { value: 'contacted', label: 'Связались' },
  { value: 'closed', label: 'Закрыта' },
];

export function AdminLeadsPage() {
  const queryClient = useQueryClient();

  const {
    data: leads,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-leads'] }),
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink-950">Заявки</h1>
      <p className="mt-1 text-sm text-ink-500">Все заявки с сайта — из форм и виджета бронирования.</p>

      <div className="mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white">
        {isLoading && (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-6">
            <ErrorState onRetry={() => refetch()} />
          </div>
        )}

        {!isLoading && !isError && leads?.length === 0 && (
          <div className="p-6">
            <EmptyState title="Заявок пока нет" />
          </div>
        )}

        {!isLoading && !isError && leads && leads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <tr>
                  <th className="px-5 py-3">Дата</th>
                  <th className="px-5 py-3">Имя</th>
                  <th className="px-5 py-3">Телефон</th>
                  <th className="px-5 py-3">Тур</th>
                  <th className="px-5 py-3">Сообщение</th>
                  <th className="px-5 py-3">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-ink-500">
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-5 py-3 font-medium text-ink-900">{lead.name}</td>
                    <td className="px-5 py-3 text-ink-600">
                      <a href={`tel:${lead.phone}`} className="hover:text-brand-600">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-ink-600">{lead.tour_title ?? '—'}</td>
                    <td className="max-w-[240px] truncate px-5 py-3 text-ink-500">{lead.message ?? '—'}</td>
                    <td className="px-5 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus({ id: lead.id, status: e.target.value as LeadStatus })
                        }
                        className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLeadsPage;
