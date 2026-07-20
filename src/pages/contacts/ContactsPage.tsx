import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { InstagramIcon } from '@/shared/ui/icons/InstagramIcon';
import { LeadForm } from '@/features/leads/ui/LeadForm';
import { Reveal } from '@/shared/ui/Reveal';
import { SITE, mailLink, telLink, whatsappLink } from '@/shared/config/site';

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: 'Телефон',
    value: SITE.phoneDisplay,
    href: telLink(),
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Написать сообщение',
    href: whatsappLink('Здравствуйте! Есть вопрос по турам.'),
    external: true,
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: SITE.email,
    href: mailLink(),
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: `@${SITE.instagramHandle}`,
    href: SITE.instagramUrl,
    external: true,
  },
];

export function ContactsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Контакты"
        title="Свяжитесь с нами удобным способом"
        description="Отвечаем в WhatsApp, по телефону и почте — обычно в течение рабочего дня."
      />

      <section className="content-container grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1fr] lg:items-start">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACT_CARDS.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="group flex flex-col gap-3 rounded-3xl border border-ink-100 bg-white p-6 transition-shadow hover:shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-400">{label}</p>
                  <p className="mt-0.5 font-medium text-ink-900">{value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2.5 rounded-3xl border border-ink-100 bg-white p-6 text-ink-600">
            <MapPin size={20} className="shrink-0 text-brand-500" />
            Офис в {SITE.city}, Казахстан. Точный адрес уточняем при встрече — обычно все вопросы решаем
            дистанционно, в WhatsApp.
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <LeadForm
              title="Напишите нам"
              description="Оставьте контакты — перезвоним и ответим на все вопросы."
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default ContactsPage;
