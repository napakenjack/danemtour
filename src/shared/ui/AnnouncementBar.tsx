import { ArrowRight, Users } from 'lucide-react';
import { SITE } from '@/shared/config/site';

export function AnnouncementBar() {
  return (
    <a
      href={SITE.whatsappGroupUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 bg-brand-600 px-4 py-2.5 text-center text-xs font-medium leading-snug text-white transition-colors hover:bg-brand-700 sm:text-sm"
    >
      <Users size={16} className="hidden shrink-0 sm:block" />
      <span>Вступайте в группу и вы будете знать актуальные цены на туры</span>
      <ArrowRight size={14} className="hidden shrink-0 sm:block" />
    </a>
  );
}
