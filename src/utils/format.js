import { CURRENCY, LOCALE } from '../config';
const wholeCurrency = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});
const decimalCurrency = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' });

export const currencySymbol =
  wholeCurrency.formatToParts(0).find((part) => part.type === 'currency')?.value ?? CURRENCY;

export function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  return (Number.isInteger(n) ? wholeCurrency : decimalCurrency).format(n);
}
export function formatPriceRange(min, max) {
  if (!min) return `Under ${formatPrice(max)}`;
  if (!max) return `${formatPrice(min)}+`;
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}
export function formatCoordinates(lat, lng) {
  const part = (value, positive, negative) =>
    `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`;
  return `${part(lat, 'N', 'S')}, ${part(lng, 'E', 'W')}`;
}
export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormat.format(date);
}
export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km).toLocaleString(LOCALE)} km`;
}
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
export function truncate(text = '', max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
