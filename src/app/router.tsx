import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/app/layout/RootLayout';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'tours',
        lazy: () => import('@/pages/tours/ToursPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'tours/:slug',
        lazy: () => import('@/pages/tours/TourDetailPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'about',
        lazy: () => import('@/pages/about/AboutPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'reviews',
        lazy: () => import('@/pages/reviews/ReviewsPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'faq',
        lazy: () => import('@/pages/faq/FaqPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'promotions',
        lazy: () => import('@/pages/promotions/PromotionsPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'blog',
        lazy: () => import('@/pages/blog/BlogPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'blog/:slug',
        lazy: () => import('@/pages/blog/BlogPostPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'contacts',
        lazy: () => import('@/pages/contacts/ContactsPage').then((m) => ({ Component: m.default })),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
