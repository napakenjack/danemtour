import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useReviews(limit?: number) {
  return useQuery({
    queryKey: ['reviews', limit ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
