import { useFaq } from '@/features/faq/api/useFaq';
import { FaqAccordion } from '@/shared/ui/FaqAccordion';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Reveal } from '@/shared/ui/Reveal';

export function FaqPage() {
  const { data: faq, isLoading, isError, refetch } = useFaq();

  return (
    <>
      <PageHeader
        eyebrow="Вопрос-ответ"
        title="Всё, что нужно знать перед поездкой"
        description="Не нашли ответ — напишите нам в WhatsApp, ответим лично и быстро."
      />

      <section className="content-container max-w-3xl py-14 sm:py-20">
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        )}
        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}
        {!isLoading && !isError && faq?.length === 0 && (
          <EmptyState title="Вопросы скоро появятся" />
        )}
        {!isLoading && !isError && faq && faq.length > 0 && (
          <Reveal>
            <FaqAccordion items={faq} />
          </Reveal>
        )}
      </section>
    </>
  );
}

export default FaqPage;
