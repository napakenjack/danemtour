import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPinned, MessageCircle, Sparkles, Star } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { SITE, whatsappLink } from '@/shared/config/site';

const DESTINATIONS = ['Турция', 'ОАЭ', 'Египет', 'Вьетнам', 'Сингапур', 'Сейшелы', 'Европа'];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-sunset-200/50 blur-3xl"
      />

      <div className="content-container relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles size={15} />
            {SITE.yearsOnMarket} лет организуем путешествия из Алматы
          </span>

          <h1 className="text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[3.6rem]">
            Хочу в отпуск?
            <br />
            <span className="text-brand-500">Мы уже подбираем</span> тур.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-500">
            Пакетные туры, авиабилеты, визы, страховки и MICE — берём заботы на себя, вы
            занимаетесь только сборами. Работаем честно, с эмпатией и без навязчивости.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/tours">
              <Button size="lg">Подобрать тур</Button>
            </Link>
            <a href={whatsappLink('Здравствуйте! Хочу подобрать тур.')} target="_blank" rel="noreferrer">
              <Button variant="whatsapp" size="lg">
                <MessageCircle size={18} />
                Написать в WhatsApp
              </Button>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 text-sm text-ink-500">
            <MapPinned size={16} className="text-brand-500" />
            <span>Направления:</span>
            {DESTINATIONS.map((d, i) => (
              <span key={d} className="text-ink-700">
                {d}
                {i < DESTINATIONS.length - 1 && <span className="text-ink-300"> · </span>}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft sm:aspect-[5/6]">
            <img
              src="https://images.unsplash.com/photo-1527142879-95b61a0b8226?auto=format&fit=crop&w=1000&q=80"
              alt="Путешествие мечты"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl bg-white/95 px-5 py-4 shadow-soft backdrop-blur sm:-left-10">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <Star key={i} size={16} className="fill-sunset-400 text-sunset-400" />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-bold text-ink-950">4.9 из 5</p>
              <p className="text-ink-500">по отзывам туристов</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
