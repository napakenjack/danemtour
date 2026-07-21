import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '@/features/auth/model/schema';
import { useAuth } from '@/app/auth/AuthContext';
import { FieldWrapper, Input } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';

function translateAuthError(message: string) {
  if (message.includes('Invalid login credentials')) return 'Неверный email или пароль';
  if (message.includes('Email not confirmed')) return 'Email ещё не подтверждён — проверьте почту';
  return 'Не получилось войти. Попробуйте ещё раз.';
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/account';

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    setIsPending(true);
    try {
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(translateAuthError(error instanceof Error ? error.message : ''));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldWrapper label="Email" htmlFor="login-email" error={errors.email?.message}>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          hasError={!!errors.email}
          {...register('email')}
        />
      </FieldWrapper>

      <FieldWrapper label="Пароль" htmlFor="login-password" error={errors.password?.message}>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          hasError={!!errors.password}
          {...register('password')}
        />
      </FieldWrapper>

      {formError && <p className="text-sm text-sunset-600">{formError}</p>}

      <Button type="submit" isLoading={isPending} className="w-full">
        Войти
      </Button>

      <p className="text-center text-sm text-ink-500">
        Нет аккаунта?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
