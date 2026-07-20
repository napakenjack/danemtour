export function formatPrice(value: number, currency = 'KZT') {
  const formatted = new Intl.NumberFormat('ru-RU').format(value);
  const symbol = currency === 'KZT' ? '₸' : currency;
  return `${formatted} ${symbol}`;
}

export function formatDuration(days: number) {
  const rem10 = days % 10;
  const rem100 = days % 100;
  let word = 'дней';
  if (rem100 < 11 || rem100 > 14) {
    if (rem10 === 1) word = 'день';
    else if (rem10 >= 2 && rem10 <= 4) word = 'дня';
  }
  return `${days} ${word}`;
}

export const segmentLabels: Record<string, string> = {
  economy: 'Эконом',
  standard: 'Стандарт',
  premium: 'Премиум',
  mice: 'MICE',
};
