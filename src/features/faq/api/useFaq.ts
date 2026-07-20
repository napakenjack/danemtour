import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useFaq() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
