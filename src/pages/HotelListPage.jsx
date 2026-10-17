import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Icon from '../components/common/Icon';
import Pagination from '../components/common/Pagination';
import StateMessage from '../components/common/StateMessage';
import PageHeader from '../components/layout/PageHeader';
import HotelFilters from '../components/hotels/HotelFilters';
import HotelSearchBar from '../components/hotels/HotelSearchBar';
import HotelList, { HotelListSkeleton } from '../components/hotels/HotelList';
import DeleteHotelDialog from '../components/hotels/DeleteHotelDialog';
import { fetchHotels, selectHotelList } from '../features/hotels/hotelsSlice';
import { useHotelQuery } from '../hooks/useHotelQuery';
import { useHotelDelete } from '../hooks/useHotelDelete';
import { usePersistentState } from '../hooks/usePersistentState';
import { PAGE_SIZES, SORT_OPTIONS } from '../config';
import { formatPriceRange } from '../utils/format';
import './HotelListPage.css';

export default function HotelListPage() {
  const dispatch = useDispatch();
  const { query, update, hrefFor, reset, hasActiveFilters } = useHotelQuery();
  const { items, total, status, error } = useSelector(selectHotelList);
  const [storedView, setView] = usePersistentState('hotel-list-view', 'list');
  const view = storedView === 'grid' ? 'grid' : 'list';
  const [filtersOpen, setFiltersOpen] = useState(false);

  // role based access
  const [role, setRole] = useState('Admin');
  const offset = (query.page - 1) * query.limit;
  const pageCount = Math.max(1, Math.ceil(total / query.limit));
  const apiParams = useMemo(
    () => ({
      title: query.title,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort,
      offset: (query.page - 1) * query.limit,
      limit: query.limit,
    }),
    [query]
  );

  const load = useCallback(() => dispatch(fetchHotels(apiParams)), [dispatch, apiParams]);

  useEffect(() => {
    const request = load();
    return () => request.abort();
  }, [load]);

  // notfound
  useEffect(() => {
    if (status === 'succeeded' && items.length === 0 && total > 0 && query.page > pageCount) {
      update({ page: pageCount }, { resetPage: false });
    }
  }, [status, items.length, total, query.page, pageCount, update]);

  // any changes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query.page]);

  useEffect(() => {
    if (!filtersOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && setFiltersOpen(false);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [filtersOpen]);
  const { requestDelete, dialogProps } = useHotelDelete({ onDeleted: load });
  const handleSearch = useCallback((title) => update({ title }), [update]);
  const activeFilters = [
    query.title && { key: 'title', label: `“${query.title}”`, clear: { title: '' } },
    (query.minPrice || query.maxPrice) && {
      key: 'price',
      label: formatPriceRange(query.minPrice, query.maxPrice),
      clear: { minPrice: '', maxPrice: '' },
    },
  ].filter(Boolean);

  const isInitialLoad = status === 'idle' || (status === 'loading' && items.length === 0);
  const isRefreshing = status === 'loading' && items.length > 0;
  let content;
  if (status === 'failed') {
    content = (
      <StateMessage icon="alert" tone="danger" title="Couldn’t load hotels" message={error?.message}>
        <button type="button" className="btn btn--primary" onClick={load}>Try again</button>
      </StateMessage>
    );
  } else if (isInitialLoad) {
    content = <HotelListSkeleton count={Math.min(query.limit, 4)} view={view} />;
  } else if (items.length === 0) {
    content = hasActiveFilters ? (
      <StateMessage icon="search" title="No hotels match your filters" message="Try a different search term or widen the price range.">
        <button type="button" className="btn btn--secondary" onClick={reset}>Clear filters</button>
      </StateMessage>
    ) : (
      <StateMessage icon="building" title="No hotels yet" message="Add your first hotel to get started.">
        {role === 'Admin' && (
          <Link to="/hotels/new" className="btn btn--primary">
            <Icon name="plus" size={16} />Add hotel
          </Link>
        )}
      </StateMessage>
    );
  } else {
    content = <HotelList hotels={items} view={view} role={role} onDelete={role === 'Admin' ? requestDelete : undefined} />;
  }
  return (
    <>
      <Seo
        title={query.title ? `Hotels matching “${query.title}”` : 'Hotels'}
        description="Browse hotels, compare prices and find your perfect stay. Search by name and filter by price range."
      />
      <PageHeader
        variant="hero"
        title="Find your perfect stay"
        subtitle="Compare prices, explore locations on the map and pick the hotel that suits you."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Hotels' }]}
      >
        <HotelSearchBar title={query.title} onSearch={handleSearch} />
      </PageHeader>

      <div className="container list-layout">
        <div
          className={`filters-backdrop${filtersOpen ? ' is-open' : ''}`}
          onClick={() => setFiltersOpen(false)}
          aria-hidden="true"
        />
        <aside id="hotel-filters" className={`filters-panel${filtersOpen ? ' is-open' : ''}`} aria-label="Filters">
          
          <div className="filter-group" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border, #e5e7eb)', marginBottom: '1rem' }}>
            <label htmlFor="role-select" className="filter-group__label" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Select Role
            </label>
            <select
              id="role-select"

              className="select select--full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <HotelFilters
            minPrice={query.minPrice}
            maxPrice={query.maxPrice}
            hasActiveFilters={hasActiveFilters}
            resultCount={total}
            onChange={update}
            onReset={reset}
            onClose={() => setFiltersOpen(false)}
          />
        </aside>

        <section className="list-main" aria-label="Hotel results">
          <div className="list-toolbar">
            <div className="sort-bar" role="group" aria-labelledby="sort-label">
              <span className="sort-bar__label" id="sort-label">Sort by</span>
              <div className="sort-bar__options">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="sort-bar__option"
                    aria-pressed={query.sort === option.value}
                    onClick={() => update({ sort: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="list-toolbar__controls">
              {role === 'Admin' && (
                <Link to="/hotels/new" className="btn btn--primary btn--sm">
                  <Icon name="plus" size={14} /> Add hotel
                </Link>
              )}

              <button
                type="button"
                className="btn btn--secondary btn--sm filters-toggle"
                aria-controls="hotel-filters"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen(true)}
              >
                <Icon name="filter" size={14} />
                Filters
                {hasActiveFilters && <span className="badge-dot" aria-label="(active)" />}
              </button>

              <label htmlFor="page-size" className="visually-hidden">Results per page</label>
              <select
                id="page-size"
                className="select select--sm"
                value={query.limit}
                onChange={(e) => update({ limit: Number(e.target.value) })}
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>

              <div className="view-toggle" role="group" aria-label="Layout">
                <button type="button" className="icon-btn" aria-pressed={view === 'list'} aria-label="List view" onClick={() => setView('list')}>
                  <Icon name="list" size={16} />
                </button>
                <button type="button" className="icon-btn" aria-pressed={view === 'grid'} aria-label="Grid view" onClick={() => setView('grid')}>
                  <Icon name="grid" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="list-summary">
            <p className="list-summary__count" aria-live="polite">
              {isInitialLoad ? (
                'Loading hotels…'
              ) : (
                <>
                  <strong>{total}</strong> {total === 1 ? 'hotel' : 'hotels'} found
                  {items.length > 0 && (
                    <span className="list-summary__range"> · showing {offset + 1}–{offset + items.length}</span>
                  )}
                </>
              )}
            </p>
            {activeFilters.length > 0 && (
              <ul className="filter-chips" aria-label="Applied filters">
                {activeFilters.map((filter) => (
                  <li key={filter.key}>
                    <button
                      type="button"
                      className="filter-chip"
                      onClick={() => update(filter.clear)}
                      aria-label={`Remove filter ${filter.label}`}
                    >
                      {filter.label}
                      <Icon name="x" size={13} strokeWidth={2.5} />
                    </button>
                  </li>
                ))}
                {activeFilters.length > 1 && (
                  <li>
                    <button type="button" className="link-btn" onClick={reset}>Clear all</button>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="list-results" aria-busy={isRefreshing}>
            {content}
          </div>

          {items.length > 0 && (
            <div className="list-footer">
              <Pagination
                page={query.page}
                pageCount={pageCount}
                getHref={(page) => hrefFor({ page }, { resetPage: false })}
              />
            </div>
          )}
        </section>
      </div>

      <DeleteHotelDialog {...dialogProps} />
    </>
  );
}