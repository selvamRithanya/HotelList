import { useEffect, useState } from 'react';
import Icon from '../common/Icon';
import './HotelSearchBar.css';

const SEARCH_DEBOUNCE_MS = 400;

// Large search widget shown in the list page's header. Searches as the user types (debounced)
// or immediately on submit. Emits onSearch(title).
export default function HotelSearchBar({ title, onSearch }) {
  const [search, setSearch] = useState(title);

  // Keep the input in sync when the search changes elsewhere (reset, back button).
  useEffect(() => {
    setSearch((current) => (current.trim() === title ? current : title));
  }, [title]);

  useEffect(() => {
    const next = search.trim();
    if (next === title) return undefined;
    const timer = setTimeout(() => onSearch(next), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, title, onSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(search.trim());
  };

  return (
    <form role="search" className="search-widget" onSubmit={handleSubmit}>
      <label className="search-widget__field" htmlFor="hotel-search">
        <span className="search-widget__label">Hotel name</span>
        <span className="search-widget__control">
          <Icon name="search" size={20} className="search-widget__icon" />
          <input
            id="hotel-search"
            type="search"
            className="search-widget__input"
            placeholder="Search hotels by name…"
            value={search}
            maxLength={255}
            autoComplete="off"
            onChange={(event) => setSearch(event.target.value)}
          />
        </span>
      </label>
      <button type="submit" className="btn btn--cta btn--lg search-widget__submit">
        <Icon name="search" size={18} />
        Search
      </button>
    </form>
  );
}
