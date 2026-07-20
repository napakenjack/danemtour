import { Phone } from 'lucide-react';
import { LeadForm } from '@/features/leads/ui/LeadForm';
import { Reveal } from '@/shared/ui/Reveal';
import { SITE, telLink } from '@/shared/config/site';

export function CtaSection() {
  return (
    <section id="lead-form" className="relative overflow-hidden bg-brand-950 py-20 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div className="content-container relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-brand-300">
            Пора отдыхать
          </span>
          <h2 className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">
            Расскажите, куда хотите — мы найдём лучший вариант
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/70">
            Оставьте заявку, и мы перезвоним с подборкой туров под ваш бюджет и даты.
            Или позвоните сами — всегда рады помочь.
          </p>
          <a
            href={telLink()}
            className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-brand-300"
          >
            <Phone size={20} />
            {SITE.phoneDisplay}
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white p-6 text-ink-900 shadow-soft sm:p-8">
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
