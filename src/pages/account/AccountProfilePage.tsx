import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/auth/AuthContext';
import { supabase } from '@/shared/api/supabase';
import { FieldWrapper, Input } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';

interface ProfileFormValues {
  fullName: string;
  phone: string;
}

export function AccountProfilePage() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProfileFormValues>({
    values: { fullName: profile?.full_name ?? '', phone: profile?.phone ?? '' },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: values.fullName, phone: values.phone || null })
        .eq('id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))} className="max-w-md space-y-4">
      <FieldWrapper label="Email" htmlFor="profile-email">
        <Input id="profile-email" value={user?.email ?? ''} disabled className="opacity-60" />
      </FieldWrapper>

      <FieldWrapper label="Имя" htmlFor="profile-name">
        <Input id="profile-name" {...register('fullName')} />
      </FieldWrapper>

      <FieldWrapper label="Телефон" htmlFor="profile-phone">
        <Input id="profile-phone" type="tel" placeholder="+7 707 000 00 00" {...register('phone')} />
      </FieldWrapper>

      {isSuccess && <p className="text-sm text-brand-600">Сохранено</p>}

      <Button type="submit" isLoading={isPending} disabled={!isDirty}>
        Сохранить
      </Button>
    </form>
  );
}

export default AccountProfilePage;
