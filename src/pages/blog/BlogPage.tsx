import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useBlogPosts } from '@/features/blog/api/useBlogPosts';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { Reveal } from '@/shared/ui/Reveal';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export function BlogPage() {
  const { data: posts, isLoading, isError, refetch } = useBlogPosts();

  return (
    <>
      <PageHeader
        eyebrow="Блог"
        title="Полезное для путешественников"
        description="Сезоны, визы и советы по направлениям — из первых рук."
      />

      <section className="content-container py-14 sm:py-20">
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3]" />
            ))}
          </div>
        )}

        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && posts?.length === 0 && (
          <EmptyState title="Статьи скоро появятся" description="Мы уже готовим первые материалы." />
        )}

        {!isLoading && !isError && posts && posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.08}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ink-100">
                    {post.cover_image_url && (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <p className="text-xs uppercase tracking-wide text-ink-400">
                      {dateFormatter.format(new Date(post.published_at))}
                    </p>
                    <h2 className="text-xl leading-snug text-ink-950">{post.title}</h2>
                    <p className="line-clamp-2 flex-1 text-sm text-ink-500">{post.excerpt}</p>
                    <span className="mt-2 flex items-center gap-1 text-sm font-medium text-brand-600">
                      Читать
                      <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default BlogPage;
