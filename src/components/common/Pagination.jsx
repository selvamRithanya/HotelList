import { Link } from 'react-router-dom';
import Icon from './Icon';
import './Pagination.css';

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

// Page numbers to show, with 'start-gap' / 'end-gap' markers for ellipses,
// e.g. [1, 'start-gap', 4, 5, 6, 'end-gap', 10].
export function getPageItems(current, total, siblings = 1) {
  const maxVisible = siblings * 2 + 5;
  if (total <= maxVisible) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showStartGap = left > 2;
  const showEndGap = right < total - 1;

  if (!showStartGap) return [...range(1, 3 + siblings * 2), 'end-gap', total];
  if (!showEndGap) return [1, 'start-gap', ...range(total - (2 + siblings * 2), total)];
  return [1, 'start-gap', ...range(left, right), 'end-gap', total];
}

// Renders links when `getHref` is given (crawlable, URL-driven), otherwise buttons calling `onPageChange`.
export default function Pagination({ page, pageCount, getHref, onPageChange, label = 'Pagination' }) {
  if (pageCount <= 1) return null;

  const control = (target, content, { ariaLabel, current = false, disabled = false } = {}) => {
    const className = 'pagination__item';
    if (disabled) {
      return (
        <span className={className} aria-disabled="true" aria-label={ariaLabel}>
          {content}
        </span>
      );
    }
    const common = { className, 'aria-label': ariaLabel, 'aria-current': current ? 'page' : undefined };
    return getHref ? (
      <Link to={getHref(target)} {...common}>{content}</Link>
    ) : (
      <button type="button" onClick={() => onPageChange(target)} {...common}>{content}</button>
    );
  };

  return (
    <nav className="pagination" aria-label={label}>
      <ul className="pagination__list">
        <li>{control(1, <Icon name="chevronsLeft" size={16} />, { ariaLabel: 'First page', disabled: page === 1 })}</li>
        <li>{control(page - 1, <Icon name="chevronLeft" size={16} />, { ariaLabel: 'Previous page', disabled: page === 1 })}</li>
        {getPageItems(page, pageCount).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>{control(item, item, { ariaLabel: `Page ${item}`, current: item === page })}</li>
          ) : (
            <li key={item} className="pagination__gap" aria-hidden="true">…</li>
          )
        )}
        <li>{control(page + 1, <Icon name="chevronRight" size={16} />, { ariaLabel: 'Next page', disabled: page === pageCount })}</li>
        <li>{control(pageCount, <Icon name="chevronsRight" size={16} />, { ariaLabel: 'Last page', disabled: page === pageCount })}</li>
      </ul>
    </nav>
  );
}
