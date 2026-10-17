import { useEffect, useState } from 'react';
import Collapsible from '../common/Collapsible';
import Icon from '../common/Icon';
import { PRICE_PRESETS } from '../../config';
import { formatPriceRange } from '../../utils/format';
import { validatePriceRange } from '../../utils/validation';
import './HotelFilters.css';

// Sidebar with price filters
export default function HotelFilters({ minPrice, maxPrice, hasActiveFilters, resultCount, onChange, onReset, onClose }) {
  const [range, setRange] = useState({ min: minPrice, max: maxPrice });
  const [rangeError, setRangeError] = useState('');
  useEffect(() => {
    setRange({ min: minPrice, max: maxPrice });
    setRangeError('');
  }, [minPrice, maxPrice]);
  const applyPrice = (event) => {
    event.preventDefault();
    const min = range.min.trim();
    const max = range.max.trim();
    const error = validatePriceRange(min, max);
    setRangeError(error);
    if (!error) onChange({ minPrice: min, maxPrice: max });
  };
  const togglePreset = (preset) => {
    const active = preset.min === minPrice && preset.max === maxPrice;
    onChange(active ? { minPrice: '', maxPrice: '' } : { minPrice: preset.min, maxPrice: preset.max });
  };
  return (
    <div className="filters">
      <div className="filters__header">
        <h2 className="filters__title">
          <Icon name="filter" size={16} />
          Select filters
        </h2>
        {hasActiveFilters && (
          <button type="button" className="link-btn" onClick={onReset}>
            Clear all
          </button>
        )}
        <button type="button" className="icon-btn icon-btn--plain filters__close" onClick={onClose} aria-label="Close filters">
          <Icon name="x" size={18} />
        </button>
      </div>
      <Collapsible title="Price per night">
        <div className="price-options" role="group" aria-label="Quick price ranges">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={`${preset.min}-${preset.max}`}
              type="button"
              className="price-option"
              aria-pressed={preset.min === minPrice && preset.max === maxPrice}
              onClick={() => togglePreset(preset)}
            >
              <span className="price-option__box" aria-hidden="true">
                <Icon name="check" size={12} strokeWidth={3} />
              </span>
              {formatPriceRange(preset.min, preset.max)}
            </button>
          ))}
        </div>
      </Collapsible>
      <Collapsible title="Your budget">
        <form onSubmit={applyPrice} noValidate>
          <div className="price-inputs">
            <div className="field">
              <label className="field__label" htmlFor="filter-min-price">Min</label>
              <input
                id="filter-min-price"
                type="number"
                className="input input--sm"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="0"
                value={range.min}
                aria-invalid={Boolean(rangeError)}
                aria-describedby={rangeError ? 'filter-price-error' : undefined}
                onChange={(event) => setRange((r) => ({ ...r, min: event.target.value }))}
              />
            </div>
            <span className="price-inputs__sep" aria-hidden="true">–</span>
            <div className="field">
              <label className="field__label" htmlFor="filter-max-price">Max</label>
              <input
                id="filter-max-price"
                type="number"
                className="input input--sm"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="Any"
                value={range.max}
                aria-invalid={Boolean(rangeError)}
                aria-describedby={rangeError ? 'filter-price-error' : undefined}
                onChange={(event) => setRange((r) => ({ ...r, max: event.target.value }))}
              />
            </div>
          </div>
          {rangeError && (
            <p className="field__error filters__error" id="filter-price-error" role="alert">
              {rangeError}
            </p>
          )}
          <button type="submit" className="btn btn--outline btn--sm btn--block">
            Apply budget
          </button>
        </form>
      </Collapsible>
      <div className="filters__footer">
        <button type="button" className="btn btn--cta btn--block" onClick={onClose}>
          Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </button>
      </div>
    </div>
  );
}
