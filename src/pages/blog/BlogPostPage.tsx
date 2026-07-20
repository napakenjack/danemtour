import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useBlogPost } from '@/features/blog/api/useBlogPosts';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState } from '@/shared/ui/StateMessage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, isLoading, isError, error, refetch } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="content-container max-w-3xl py-16">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="mt-4 aspect-[16/9] w-full" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    const isNotFound = (error as { code?: string })?.code === 'PGRST116';
    if (isNotFound) return <NotFoundPage />;
    return (
      <div className="content-container py-16">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (!post) return <NotFoundPage />;

  return (
    <article className="content-container max-w-3xl py-14 sm:py-20">
      <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-600">
        <ArrowLeft size={16} />
        Все статьи
      </Link>

      <p className="text-xs uppercase tracking-wide text-ink-400">
        {dateFormatter.format(new Date(post.published_at))}
      </p>
      <h1 className="mt-2 text-3xl leading-tight tracking-tight sm:text-4xl">{post.title}</h1>

      {post.cover_image_url && (
        <div className="mt-8 overflow-hidden rounded-3xl">
          <img src={post.cover_image_url} alt={post.title} className="aspect-[16/9] w-full object-cover" />
        </div>
      )}

      <div className="prose-content mt-8 space-y-5 text-lg leading-relaxed text-ink-600">
        {post.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export default BlogPostPage;
