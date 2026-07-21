import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '@/features/auth/model/schema';
import { useAuth } from '@/app/auth/AuthContext';
import { FieldWrapper, Input } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';

function translateAuthError(message: string) {
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Этот email уже зарегистрирован';
  }
  if (message.includes('Password should be')) return 'Пароль слишком простой — минимум 6 символов';
  return 'Не получилось зарегистрироваться. Попробуйте ещё раз.';
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    setIsPending(true);
    try {
      const { needsEmailConfirmation } = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone || undefined,
      });
      if (needsEmailConfirmation) {
        setNeedsConfirmation(true);
      } else {
        navigate('/account', { replace: true });
      }
    } catch (error) {
      setFormError(translateAuthError(error instanceof Error ? error.message : ''));
    } finally {
      setIsPending(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-500" />
        <p className="font-display text-xl text-ink-900">Проверьте почту</p>
        <p className="max-w-xs text-ink-500">
          Мы отправили письмо для подтверждения регистрации. Перейдите по ссылке в письме, затем войдите.
        </p>
        <Link to="/login">
          <Button variant="outline" size="sm" className="mt-2">
            К странице входа
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldWrapper label="Ваше имя" htmlFor="register-name" error={errors.fullName?.message}>
        <Input id="register-name" placeholder="Асель" hasError={!!errors.fullName} {...register('fullName')} />
      </FieldWrapper>

      <FieldWrapper label="Email" htmlFor="register-email" error={errors.email?.message}>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          hasError={!!errors.email}
          {...register('email')}
        />
      </FieldWrapper>

      <FieldWrapper label="Телефон (необязательно)" htmlFor="register-phone" error={errors.phone?.message}>
        <Input
          id="register-phone"
          type="tel"
          placeholder="+7 707 000 00 00"
          hasError={!!errors.phone}
          {...register('phone')}
        />
      </FieldWrapper>

      <FieldWrapper label="Пароль" htmlFor="register-password" error={errors.password?.message}>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hasError={!!errors.password}
          {...register('password')}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Повторите пароль"
        htmlFor="register-confirm"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hasError={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </FieldWrapper>

      {formError && <p className="text-sm text-sunset-600">{formError}</p>}

      <Button type="submit" isLoading={isPending} className="w-full">
        Зарегистрироваться
      </Button>

      <p className="text-center text-sm text-ink-500">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
