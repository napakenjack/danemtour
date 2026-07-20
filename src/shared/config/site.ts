export const SITE = {
  name: 'danem tour',
  tagline: 'Туристическое агентство в Алматы',
  city: 'Алматы',
  phoneDisplay: '+7 707 776 65 57',
  phoneRaw: '87077766557',
  phoneE164: '+77077766557',
  email: 'danemtour@gmail.com',
  instagramHandle: 'danemtour',
  instagramUrl: 'https://instagram.com/danemtour',
  yearsOnMarket: 7,
} as const;

export const whatsappLink = (message?: string) => {
  const phone = SITE.phoneE164.replace('+', '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${phone}${text}`;
};

export const telLink = () => `tel:${SITE.phoneE164}`;
export const mailLink = () => `mailto:${SITE.email}`;
