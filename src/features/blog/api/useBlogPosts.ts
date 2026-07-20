import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useBlogPosts(limit?: number) {
  return useQuery({
    queryKey: ['blog_posts', limit ?? 'all'],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['blog_posts', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug as string)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
