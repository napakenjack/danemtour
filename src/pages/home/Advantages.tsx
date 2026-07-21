import { Link } from 'react-router-dom';
import { ArrowRight, Clock, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';
import { SITE } from '@/shared/config/site';

const ITEMS = [
  {
    icon: HeartHandshake,
    title: 'Забота, а не продажи',
    description: 'Слушаем, а не впариваем. Подбираем тур под ваш бюджет и настроение.',
  },
  {
    icon: ShieldCheck,
    title: 'Доверие, проверенное временем',
    description: `${SITE.yearsOnMarket} лет на рынке и клиенты, которые возвращаются снова.`,
  },
  {
    icon: Users,
    title: 'Профессиональный подход',
    description: 'Визы, страховки, MICE — берём на себя всю организационную часть.',
  },
  {
    icon: Clock,
    title: 'Быстро на связи',
    description: 'Отвечаем в WhatsApp и по телефону в течение рабочего дня.',
  },
];

export function Advantages() {
  return (
    <section className="content-container-wide py-20 sm:py-28">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-10">
        <Reveal>
          <span className="eyebrow mb-4">О нас</span>
          <h2 className="text-[2rem] leading-[1.08] tracking-tight sm:text-[2.5rem]">
            Всё начинается с вас
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-500">
            Каждое путешествие проходит через маршруты и живописные локации Алматы и всего мира.
            Мы берём заботы на себя — вы занимаетесь только сборами.
          </p>

          <ul className="mt-9 space-y-6">
            {ITEMS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="font-display text-base text-ink-950">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link to="/about" className="mt-9 inline-flex">
            <Button>
              Узнать о нас больше
              <ArrowRight size={16} />
            </Button>
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
            <img
              src="/images/journey-cover.jpg"
              alt="Начало путешествия"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-8 left-6 flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-float sm:left-10">
            <p className="font-display text-3xl text-brand-600">{SITE.yearsOnMarket}+</p>
            <p className="max-w-[9rem] text-sm leading-snug text-ink-600">
              лет организуем путешествия для туристов из Алматы
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
