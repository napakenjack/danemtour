import { Clock, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Reveal } from '@/shared/ui/Reveal';

const ITEMS = [
  {
    icon: HeartHandshake,
    title: 'Забота, а не продажи',
    description: 'Слушаем, а не впариваем. Подбираем тур под ваш бюджет и настроение, а не под план продаж.',
  },
  {
    icon: ShieldCheck,
    title: 'Доверие, проверенное временем',
    description: '7 лет на рынке и клиенты, которые возвращаются снова — и приводят друзей.',
  },
  {
    icon: Users,
    title: 'Профессиональный подход',
    description: 'Визы, страховки, MICE-организация — берём на себя всю бумажную и организационную часть.',
  },
  {
    icon: Clock,
    title: 'Быстро на связи',
    description: 'Отвечаем в WhatsApp и по телефону в течение рабочего дня, а часто и быстрее.',
  },
];

export function Advantages() {
  return (
    <section className="content-container py-20 sm:py-28">
      <SectionHeading
        eyebrow="Почему danem tour"
        title="Едем в отпуск без нервов"
        description="Собрали то, за что нас выбирают клиенты снова и снова."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, description }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <div className="h-full rounded-3xl border border-ink-100 bg-white p-6 transition-shadow duration-300 hover:shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 text-lg text-ink-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
