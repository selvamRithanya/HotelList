import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import HotelImage from './HotelImage';
import { assetUrl } from '../../api/client';
import { formatCoordinates, formatPrice, truncate } from '../../utils/format';
const NEW_LISTING_MS = 7 * 24 * 60 * 60 * 1000;
const isRecent = (date) => Date.now() - new Date(date).getTime() < NEW_LISTING_MS; 
function HotelCard({ hotel, onDelete }) {
  const navigate = useNavigate();
  const detailPath = `/hotels/${hotel.id}`;
  const titleId = `hotel-${hotel.id}-title`;
  const handleClick = (event) => {
    if (event.target.closest('a, button')) return;
    navigate(detailPath);
  };
  return (
    <article className="hotel-card" onClick={handleClick} aria-labelledby={titleId}>
      <div className="hotel-card__media">
        <HotelImage src={assetUrl(hotel.image_path)} alt={`Photo of ${hotel.title}`} />
        {isRecent(hotel.created_at) && (
          <span className="hotel-card__tag">
            <Icon name="sparkles" size={12} />
            New
          </span>
        )}
      </div>
      <div className="hotel-card__body">
        <h2 className="hotel-card__title" id={titleId}>
          <Link to={detailPath}>{hotel.title}</Link>
        </h2>
        <p className="hotel-card__location">
          <Icon name="pin" size={14} />
          {formatCoordinates(hotel.latitude, hotel.longitude)}
        </p>
        <p className="hotel-card__desc">{truncate(hotel.description, 220)}</p>
      </div>
      <div className="hotel-card__aside">
        <div className="hotel-card__pricing">
          <p className="hotel-card__price">{formatPrice(hotel.price)}</p>
          <p className="hotel-card__unit">per night</p>
        </div>
        <div className="hotel-card__actions">
          <Link to={detailPath} className="btn btn--cta btn--sm hotel-card__view" tabIndex={-1} aria-hidden="true">
            View details
          </Link>
          <div className="hotel-card__manage">
            <Link
              to={`${detailPath}/edit`}
              className="icon-btn icon-btn--primary"
              aria-label={`Edit ${hotel.title}`}
              title="Edit"
            >
              <Icon name="edit" size={15} />
            </Link>
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={() => onDelete(hotel)}
              aria-label={`Delete ${hotel.title}`}
              title="Delete"
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(HotelCard);
