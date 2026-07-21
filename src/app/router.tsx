import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/app/layout/RootLayout';
import { HomePage } from '@/pages/home/HomePage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { RequireAdmin, RequireAuth } from '@/app/auth/RouteGuards';

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
      {
        path: 'login',
        lazy: () => import('@/pages/auth/LoginPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'register',
        lazy: () => import('@/pages/auth/RegisterPage').then((m) => ({ Component: m.default })),
      },
      {
        path: 'account',
        element: <RequireAuth />,
        children: [
          {
            lazy: () => import('@/pages/account/AccountLayout').then((m) => ({ Component: m.default })),
            children: [
              {
                index: true,
                lazy: () =>
                  import('@/pages/account/AccountProfilePage').then((m) => ({ Component: m.default })),
              },
              {
                path: 'requests',
                lazy: () =>
                  import('@/pages/account/AccountRequestsPage').then((m) => ({ Component: m.default })),
              },
              {
                path: 'favorites',
                lazy: () =>
                  import('@/pages/account/AccountFavoritesPage').then((m) => ({ Component: m.default })),
              },
            ],
          },
        ],
      },
      {
        path: 'admin',
        element: <RequireAdmin />,
        children: [
          {
            lazy: () => import('@/pages/admin/AdminLayout').then((m) => ({ Component: m.default })),
            children: [
              { index: true, element: <Navigate to="/admin/leads" replace /> },
              {
                path: 'leads',
                lazy: () => import('@/pages/admin/AdminLeadsPage').then((m) => ({ Component: m.default })),
              },
              {
                path: 'tours',
                lazy: () => import('@/pages/admin/AdminToursPage').then((m) => ({ Component: m.default })),
              },
              {
                path: 'reviews',
                lazy: () => import('@/pages/admin/AdminReviewsPage').then((m) => ({ Component: m.default })),
              },
              {
                path: 'faq',
                lazy: () => import('@/pages/admin/AdminFaqPage').then((m) => ({ Component: m.default })),
              },
              {
                path: 'blog',
                lazy: () => import('@/pages/admin/AdminBlogPage').then((m) => ({ Component: m.default })),
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
