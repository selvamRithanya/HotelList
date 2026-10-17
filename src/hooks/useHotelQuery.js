import { useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { PAGE_SIZES, SORT_OPTIONS } from '../config';

const DEFAULTS = { title: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1, limit: PAGE_SIZES[0] };

const isPrice = (value) => value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;

function parse(params) {
  const price = (key) => {
    const value = (params.get(key) ?? '').trim();
    return isPrice(value) ? value : '';
  };
  const sort = params.get('sort');
  const page = Number.parseInt(params.get('page'), 10);
  const limit = Number(params.get('limit'));
  const minPrice = price('minPrice');
  let maxPrice = price('maxPrice');
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) maxPrice = '';

  return {
    title: (params.get('title') ?? '').trim(),
    minPrice,
    maxPrice,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : DEFAULTS.sort,
    page: page > 0 ? page : DEFAULTS.page,
    limit: PAGE_SIZES.includes(limit) ? limit : DEFAULTS.limit,
  };
}

function toSearch(query) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== '' && value != null && value !== DEFAULTS[key]) params.set(key, String(value));
  });
  const search = params.toString();
  return search ? `?${search}` : '';
}

// The list page's search, filters, sort and pagination live in the URL so they
// survive reloads, can be shared, and work with the browser's back button.
export function useHotelQuery() {
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const query = useMemo(() => parse(params), [params]);

  // Changing a filter returns to page 1 unless told otherwise.
  const merge = useCallback(
    (changes, { resetPage = true } = {}) => ({ ...query, ...(resetPage ? { page: 1 } : null), ...changes }),
    [query]
  );

  const update = useCallback(
    (changes, options) => setParams(toSearch(merge(changes, options))),
    [merge, setParams]
  );

  const hrefFor = useCallback(
    (changes, options) => `${pathname}${toSearch(merge(changes, options))}`,
    [merge, pathname]
  );

  const reset = useCallback(
    () => setParams(toSearch({ ...DEFAULTS, sort: query.sort, limit: query.limit })),
    [query.sort, query.limit, setParams]
  );

  const hasActiveFilters = Boolean(query.title || query.minPrice || query.maxPrice);

  return { query, update, hrefFor, reset, hasActiveFilters };
}
