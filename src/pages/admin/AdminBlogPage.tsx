import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState, EmptyState } from '@/shared/ui/StateMessage';
import { BlogFormDialog } from '@/pages/admin/BlogFormDialog';
import type { BlogPost } from '@/shared/types/database.types';

export function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { mutate: deletePost } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
    },
  });

  const openCreate = () => {
    setEditingPost(null);
    setIsDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink-950">Блог</h1>
          <p className="mt-1 text-sm text-ink-500">Статьи, отображаются на странице «Блог».</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} />
          Новая статья
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {!isLoading && isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && posts?.length === 0 && (
          <EmptyState title="Статей пока нет" description="Нажмите «Новая статья», чтобы создать первую." />
        )}

        {!isLoading &&
          !isError &&
          posts?.map((post) => (
            <div key={post.id} className="rounded-2xl border border-ink-100 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink-900">{post.title}</p>
                    <Badge variant={post.is_published ? 'brand' : 'neutral'}>
                      {post.is_published ? 'Опубликована' : 'Черновик'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{post.excerpt}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    aria-label="Редактировать"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Удалить статью?')) deletePost(post.id);
                    }}
                    aria-label="Удалить"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sunset-500 transition-colors hover:bg-sunset-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <BlogFormDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} post={editingPost} />
    </div>
  );
}

export default AdminBlogPage;
