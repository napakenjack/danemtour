import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useFaq } from '@/features/faq/api/useFaq';
import { FaqAccordion } from '@/shared/ui/FaqAccordion';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState } from '@/shared/ui/StateMessage';
import { Reveal } from '@/shared/ui/Reveal';
import { Button } from '@/shared/ui/Button';
import { whatsappLink } from '@/shared/config/site';

export function FaqPreview() {
  const { data: faq, isLoading, isError, refetch } = useFaq();
  const preview = faq?.slice(0, 5);

  return (
    <section className="bg-ink-100/50 py-20 sm:py-28">
      <div className="content-container-wide grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-28">
          <span className="eyebrow mb-3">Вопрос-ответ</span>
          <h2 className="text-[2rem] leading-[1.08] tracking-tight sm:text-[2.5rem]">
            Всё, что нужно знать перед вашим путешествием
          </h2>

          <div className="mt-8 hidden overflow-hidden rounded-[2rem] shadow-soft sm:block">
            <img
              src="/images/faq-cover.jpg"
              alt="Вопросы о туре"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white p-5 shadow-card">
            <MessageCircle size={20} className="mt-0.5 shrink-0 text-brand-500" />
            <div>
              <p className="font-display text-base text-ink-950">Не нашли свой вопрос?</p>
              <p className="mt-1 text-sm text-ink-500">Напишите в WhatsApp — ответим лично.</p>
              <a
                href={whatsappLink('Здравствуйте! У меня есть вопрос про тур.')}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex"
              >
                <Button variant="whatsapp" size="sm">
                  Написать в WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </Reveal>

        <div>
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          )}
          {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}
          {!isLoading && !isError && preview && <FaqAccordion items={preview} />}

          <Link to="/faq" className="mt-6 inline-flex">
            <Button variant="ghost">
              Все вопросы
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
