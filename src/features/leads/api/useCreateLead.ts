import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { LeadFormValues } from '@/features/leads/model/schema';

interface CreateLeadInput extends LeadFormValues {
  tourId?: string;
  tourTitle?: string;
  source?: string;
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async ({ tourId, tourTitle, source, ...values }: CreateLeadInput) => {
      const { error } = await supabase.from('leads').insert({
        name: values.name,
        phone: values.phone,
        message: values.message || null,
        tour_id: tourId ?? null,
        tour_title: tourTitle ?? null,
        source: source ?? 'website',
      });
      if (error) throw error;
    },
  });
}
