import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useSubscribe() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email });
      if (error && error.code !== '23505') throw error; // 23505 = уже подписан, считаем успехом
    },
  });
}
