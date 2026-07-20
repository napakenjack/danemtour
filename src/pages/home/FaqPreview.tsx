import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFaq } from '@/features/faq/api/useFaq';
import { FaqAccordion } from '@/shared/ui/FaqAccordion';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState } from '@/shared/ui/StateMessage';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';

export function FaqPreview() {
  const { data: faq, isLoading, isError, refetch } = useFaq();
  const preview = faq?.slice(0, 4);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="content-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHeading
          eyebrow="Вопрос-ответ"
          title="Частые вопросы про туры"
          description="Не нашли ответ — напишите в WhatsApp, ответим лично."
        />

        <div>
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
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
