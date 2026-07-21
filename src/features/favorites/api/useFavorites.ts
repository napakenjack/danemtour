import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { useAuth } from '@/app/auth/AuthContext';
import type { Tour } from '@/shared/types/database.types';

export function useFavoriteIds() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', 'ids', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('favorites').select('tour_id').eq('user_id', user!.id);
      if (error) throw error;
      return new Set(data.map((row) => row.tour_id));
    },
  });
}

export function useFavoriteTours() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', 'tours', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Tour[]> => {
      const { data: favRows, error: favError } = await supabase
        .from('favorites')
        .select('tour_id')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (favError) throw favError;

      const tourIds = favRows.map((row) => row.tour_id);
      if (tourIds.length === 0) return [];

      const { data, error } = await supabase.from('tours').select('*').in('id', tourIds);
      if (error) throw error;

      const tourById = new Map(data.map((tour) => [tour.id, tour]));
      return tourIds.map((id) => tourById.get(id)).filter((tour): tour is Tour => !!tour);
    },
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tourId, isFavorite }: { tourId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tour_id', tourId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('favorites').insert({ user_id: user.id, tour_id: tourId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
