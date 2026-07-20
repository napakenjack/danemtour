import { Briefcase, HeartHandshake, MapPin, PlaneTakeoff, ShieldCheck, Users } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';
import { SITE, whatsappLink } from '@/shared/config/site';

const SERVICES = [
  { icon: PlaneTakeoff, label: 'Пакетные туры и авиабилеты' },
  { icon: ShieldCheck, label: 'Визы и страховки' },
  { icon: Users, label: 'Индивидуальные туры под запрос' },
  { icon: Briefcase, label: 'MICE — деловые поездки и конференции' },
];

const STATS = [
  { value: `${SITE.yearsOnMarket}`, label: 'лет на рынке' },
  { value: '7', label: 'направлений в каталоге' },
  { value: '4.9', label: 'средний рейтинг отзывов' },
];

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="О компании"
        title="Туристическое агентство, которому доверяют"
        description={`${SITE.name} — команда из Алматы, которая уже ${SITE.yearsOnMarket} лет помогает казахстанцам находить свой идеальный отдых.`}
      />

      <section className="content-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <Reveal>
          <h2 className="text-3xl leading-tight tracking-tight sm:text-4xl">
            Наша работа — снять с вас все заботы о поездке
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-500">
            Мы начинали с сарафанного радио — и до сих пор большинство клиентов приходят по
            рекомендации друзей и коллег. Это лучшее доказательство того, что мы держим слово:
            подбираем тур честно, объясняем нюансы и остаёмся на связи от бронирования до
            возвращения домой.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">
            Работаем с направлениями на любой сегмент — от горящих туров эконом-класса до
            люксового отдыха и корпоративных MICE-поездок.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-4 text-center">
                <p className="font-display text-3xl text-brand-500">{s.value}</p>
                <p className="mt-1 text-xs text-ink-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[2rem] shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80"
              alt="Команда danem tour"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="content-container">
          <Reveal>
            <h2 className="text-3xl tracking-tight sm:text-4xl">Что мы делаем</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, label }, i) => (
              <Reveal key={label} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-ink-100 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <Icon size={20} />
                  </span>
                  <p className="mt-4 text-ink-800">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="content-container py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-brand-950 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <p className="flex items-center gap-2 text-brand-300">
                <MapPin size={18} />
                {SITE.city}, Казахстан
              </p>
              <h2 className="mt-2 text-2xl tracking-tight sm:text-3xl">
                Есть вопросы? Поговорим в WhatsApp
              </h2>
            </div>
            <a href={whatsappLink('Здравствуйте! Хочу узнать подробнее про danem tour.')} target="_blank" rel="noreferrer">
              <Button variant="whatsapp" size="lg">
                <HeartHandshake size={18} />
                Написать нам
              </Button>
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default AboutPage;
