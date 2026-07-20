import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/shared/config/site';

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappLink('Здравствуйте! Хочу подобрать тур.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Написать в WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform duration-200 hover:scale-110 active:scale-95 sm:bottom-8 sm:right-8"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </a>
  );
}
