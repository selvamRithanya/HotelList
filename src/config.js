const env = import.meta.env;

export const SITE_NAME = env.VITE_SITE_NAME || 'PR Hotels';
export const CURRENCY = env.VITE_CURRENCY || 'INR';
export const LOCALE = env.VITE_LOCALE || 'en-IN';

export const PAGE_SIZES = [10, 20, 50];

// Values must match the sort keys accepted by GET /api/hotels.
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'title_asc', label: 'Name: A to Z' },
];

export const PRICE_PRESETS = [
  { min: '', max: '2000' },
  { min: '2000', max: '5000' },
  { min: '5000', max: '10000' },
  { min: '10000', max: '' },
];

// Must match the Service's upload limits.
export const MAX_IMAGE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Initial map view for the location picker when no coordinates are entered yet.
export const DEFAULT_MAP_CENTER = [20.5937, 78.9629];
export const DEFAULT_MAP_ZOOM = 4;
