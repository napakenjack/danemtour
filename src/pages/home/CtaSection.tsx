import { Phone } from 'lucide-react';
import { LeadForm } from '@/features/leads/ui/LeadForm';
import { Reveal } from '@/shared/ui/Reveal';
import { SITE, telLink } from '@/shared/config/site';

export function CtaSection() {
  return (
    <section id="lead-form" className="relative overflow-hidden bg-ink-950 py-20 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div className="content-container-wide relative grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <span className="eyebrow mb-4 text-white/60">Пора отдыхать</span>
          <h2 className="text-[2.1rem] leading-[1.1] tracking-tight sm:text-[2.75rem]">
            Спланируем ваше идеальное путешествие уже сегодня
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/70">
            Оставьте заявку, и мы перезвоним с подборкой туров под ваш бюджет и даты. Или
            позвоните сами — всегда рады помочь.
          </p>
          <a
            href={telLink()}
            className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-brand-300"
          >
            <Phone size={20} />
            {SITE.phoneDisplay}
          </a>

          <div className="mt-10 hidden gap-4 sm:flex">
            <div className="w-36 -rotate-3 overflow-hidden rounded-3xl border-4 border-white/10 shadow-float">
              <img
                src="/images/cta-cover-1.jpg"
                alt=""
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="mt-8 w-36 rotate-3 overflow-hidden rounded-3xl border-4 border-white/10 shadow-float">
              <img
                src="/images/cta-cover-2.jpg"
                alt=""
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-white p-6 text-ink-900 shadow-float sm:p-8">
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
