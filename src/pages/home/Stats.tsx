import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Globe2, Percent, ShieldCheck, Users } from 'lucide-react';
import { Reveal } from '@/shared/ui/Reveal';
import { SITE } from '@/shared/config/site';

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

const STAT_ITEMS = [
  { icon: Globe2, value: '7+', label: 'направлений отдыха' },
  { icon: Users, value: '2 500+', label: 'туристов доверились нам' },
  { icon: ShieldCheck, value: `${SITE.yearsOnMarket}`, label: 'лет на рынке Алматы' },
  { icon: Percent, value: '98%', label: 'клиентов возвращаются снова' },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const count = useCountUp(2500, inView);

  return (
    <section className="bg-ink-100/50 py-20 sm:py-28">
      <div className="content-container text-center">
        <Reveal className="mx-auto max-w-xl">
          <span className="eyebrow mb-4 justify-center">Статистически говоря</span>
          <h2 className="text-[2rem] leading-[1.1] tracking-tight sm:text-[2.5rem]">
            Как мы держим доверие клиентов из года в год
          </h2>
        </Reveal>

        <div ref={ref} className="relative mx-auto mt-14 flex h-56 max-w-md items-center justify-center sm:h-72">
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-ink-300/70"
          />
          <div
            aria-hidden
            className="absolute inset-8 rounded-full bg-gradient-to-br from-brand-100/70 via-white to-transparent blur-xl sm:inset-12"
          />
          <div className="relative">
            <p className="font-display text-6xl font-extrabold tracking-tight text-ink-950 sm:text-7xl">
              {count.toLocaleString('ru-RU')}+
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-ink-500">
              туристов уже отдохнули
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:mt-16 lg:grid-cols-4">
          {STAT_ITEMS.map(({ icon: Icon, value, label }, i) => (
            <Reveal key={label} delay={i * 0.07}>
              <div className="flex h-full flex-col items-center gap-3 rounded-3xl border border-ink-200/70 bg-white px-4 py-7">
                <Icon size={22} className="text-brand-500" />
                <p className="font-display text-2xl text-ink-950">{value}</p>
                <p className="text-sm leading-snug text-ink-500">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
