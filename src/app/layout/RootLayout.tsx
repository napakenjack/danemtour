import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from '@/app/layout/Header';
import { Footer } from '@/app/layout/Footer';
import { WhatsAppFloatingButton } from '@/shared/ui/WhatsAppFloatingButton';

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
