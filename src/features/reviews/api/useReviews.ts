import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useReviews(limit?: number) {
  return useQuery({
    queryKey: ['reviews', limit ?? 'all'],
    queryFn: async () => {
      // Явный фильтр, не только RLS: авторизованный админ по политике "Admins manage
      // reviews" видит и неопубликованные строки, а этот хук используется и на
      // публичных страницах (может открыть залогиненный админ).
      let query = supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
