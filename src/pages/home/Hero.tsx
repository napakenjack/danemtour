import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Sparkles, Star } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { BookingWidget } from '@/features/leads/ui/BookingWidget';
import { SITE, whatsappLink } from '@/shared/config/site';

const DESTINATIONS = ['Турция', 'ОАЭ', 'Египет', 'Вьетнам', 'Сингапур', 'Сейшелы', 'Европа'];

const HERO_FALLBACK_IMAGE = '/images/hero-cover.png';
const HERO_MAX_SLIDES = 12;
const HERO_SLIDE_INTERVAL = 6000;

function probeImage(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Numbered hero-cover-1.png, hero-cover-2.png, ... picked up automatically; stops at the first gap. */
function useHeroImages() {
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const candidates = Array.from({ length: HERO_MAX_SLIDES }, (_, i) => `/images/hero-cover-${i + 1}.png`);
      const found = await Promise.all(candidates.map(probeImage));
      const sequential: string[] = [];
      for (let i = 0; i < found.length; i++) {
        if (!found[i]) break;
        sequential.push(candidates[i]);
      }
      if (!cancelled) setImages(sequential.length > 0 ? sequential : [HERO_FALLBACK_IMAGE]);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

function HeroBackground({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, HERO_SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <AnimatePresence>
      <motion.img
        key={images[index]}
        src={images[index]}
        alt="Путешествие мечты"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
    </AnimatePresence>
  );
}

export function Hero() {
  const images = useHeroImages();

  return (
    <section className="relative bg-white pb-24 pt-6 sm:pb-28 sm:pt-8">
      <div className="mx-auto w-full max-w-(--container-wide) px-0 sm:px-8 lg:px-10">
        <div className="relative isolate flex min-h-[240px] flex-col justify-end overflow-hidden bg-ink-950 text-white sm:min-h-[540px] sm:rounded-[2.5rem] lg:min-h-[620px]">
          {images && <HeroBackground images={images} />}
          <div className="absolute inset-0 -z-10 hidden bg-gradient-to-b from-ink-950/70 via-ink-950/15 to-ink-950/85 sm:block" />

          <div className="relative hidden flex-col items-center px-5 pb-16 pt-20 text-center sm:flex sm:pb-20 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm"
            >
              <div className="flex -space-x-0.5">
                {[1, 2, 3].map((i) => (
                  <Star key={i} size={14} className="fill-sunset-400 text-sunset-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-white/90">
                4.9 из 5 · {SITE.yearsOnMarket} лет организуем путешествия из Алматы
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="display-hero text-[2.4rem] leading-[0.96] sm:text-[3.6rem] lg:text-[4.4rem]"
            >
              Хочу
              <br />
              <span className="text-brand-300">в отпуск?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
            >
              Мы уже подбираем тур. Пакетные туры, авиабилеты, визы, страховки и MICE — берём заботы
              на себя, вы занимаетесь только сборами.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6"
            >
              <a href={whatsappLink('Здравствуйте! Хочу подобрать тур.')} target="_blank" rel="noreferrer">
                <Button variant="whatsapp" size="lg">
                  <MessageCircle size={18} />
                  Написать в WhatsApp
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-white/60"
            >
              <Sparkles size={15} className="text-brand-300" />
              <span>Направления:</span>
              {DESTINATIONS.map((d, i) => (
                <span key={d}>
                  {d}
                  {i < DESTINATIONS.length - 1 && <span className="text-white/30"> · </span>}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="content-container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 -mt-10 px-2 sm:-mt-12"
        >
          <BookingWidget className="mx-auto max-w-4xl" />
        </motion.div>
      </div>
    </section>
  );
}
