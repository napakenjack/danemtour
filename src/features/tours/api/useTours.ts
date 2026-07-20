import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useTour(slug: string | undefined) {
  return useQuery({
    queryKey: ['tours', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slug as string)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
