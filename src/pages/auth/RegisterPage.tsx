import { PageHeader } from '@/shared/ui/PageHeader';
import { Reveal } from '@/shared/ui/Reveal';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';

export function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Личный кабинет"
        title="Регистрация"
        description="Сохраняйте историю заявок и избранные туры — регистрация занимает минуту."
      />

      <section className="content-container py-14 sm:py-20">
        <Reveal className="mx-auto max-w-md">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <RegisterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default RegisterPage;
