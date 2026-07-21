import { Play } from 'lucide-react';
import { Reveal } from '@/shared/ui/Reveal';
import { SITE } from '@/shared/config/site';

export function Experience() {
  return (
    <section className="content-container-wide py-20 sm:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="eyebrow mb-3">Ваш тур</span>
          <h2 className="text-[2rem] leading-[1.08] tracking-tight sm:text-[2.5rem]">
            Впечатления, ради которых стоит лететь
          </h2>
        </div>
        <p className="max-w-sm text-ink-500">
          Фото и видео с реальных туров наших клиентов появятся здесь совсем скоро — а пока
          смотрите свежие кадры в Instagram.
        </p>
      </div>

      <Reveal className="relative overflow-hidden rounded-[2rem] shadow-soft">
        <img
          src="/images/experience-cover.jpg"
          alt="Впечатления от тура"
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />

        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Смотреть в Instagram"
          className="group absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-ink-950 shadow-float transition-transform duration-300 group-hover:scale-110">
            <Play size={26} className="ml-1" fill="currentColor" />
          </span>
        </a>

        <div className="absolute right-5 top-5 rounded-2xl bg-white/95 px-5 py-3.5 text-center shadow-float backdrop-blur-sm sm:right-8 sm:top-8">
          <p className="font-display text-2xl leading-none text-ink-950">
            4.9<span className="text-sm text-ink-400">/5</span>
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-500">рейтинг клиентов</p>
        </div>
      </Reveal>
    </section>
  );
}
