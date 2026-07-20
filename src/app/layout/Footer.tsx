import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from '@/shared/ui/Logo';
import { InstagramIcon } from '@/shared/ui/icons/InstagramIcon';
import { NewsletterForm } from '@/features/newsletter/ui/NewsletterForm';
import { FOOTER_LINKS } from '@/app/layout/navConfig';
import { SITE, mailLink, telLink, whatsappLink } from '@/shared/config/site';

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="content-container grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo dark />
          <p className="max-w-xs text-sm leading-relaxed text-ink-400">
            {SITE.yearsOnMarket} лет подбираем туры для тех, кто хочет отдыхать без забот. Пакетные туры,
            авиабилеты, визы, страховки и MICE — от идеи до посадки в самолёт.
          </p>
          <div className="flex gap-3 pt-1">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-400 hover:text-brand-300"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-brand-400 hover:text-brand-300"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Разделы</p>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Контакты</p>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={telLink()} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Phone size={16} className="shrink-0 text-brand-400" />
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailLink()} className="flex items-center gap-2.5 transition-colors hover:text-white">
                <Mail size={16} className="shrink-0 text-brand-400" />
                {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="shrink-0 text-brand-400" />
              {SITE.city}, Казахстан
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Рассылка</p>
          <p className="mb-3 text-sm text-ink-400">Горящие туры и акции — не чаще раза в неделю.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="content-container flex flex-col items-center justify-between gap-2 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. Все права защищены.</p>
          <p>Алматы, Казахстан</p>
        </div>
      </div>
    </footer>
  );
}
