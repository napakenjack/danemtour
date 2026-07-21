import { PageHeader } from '@/shared/ui/PageHeader';
import { Reveal } from '@/shared/ui/Reveal';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export function LoginPage() {
  return (
    <>
      <PageHeader eyebrow="Личный кабинет" title="Вход в аккаунт" />

      <section className="content-container py-14 sm:py-20">
        <Reveal className="mx-auto max-w-md">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <LoginForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default LoginPage;
