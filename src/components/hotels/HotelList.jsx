import HotelCard from './HotelCard';
import './HotelList.css';

export default function HotelList({ hotels, view = 'list', onDelete }) {
  return (
    <ul className={`hotel-list hotel-list--${view}`}>
      {hotels.map((hotel) => (
        <li key={hotel.id}>
          <HotelCard hotel={hotel} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

export function HotelListSkeleton({ count = 4, view = 'list' }) {
  return (
    <ul className={`hotel-list hotel-list--${view}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="hotel-card hotel-card--skeleton">
            <div className="hotel-card__media skeleton" />
            <div className="hotel-card__body">
              <div className="skeleton" style={{ height: 18, width: '60%' }} />
              <div className="skeleton" style={{ height: 12, width: '35%' }} />
              <div className="skeleton" style={{ height: 12, width: '95%' }} />
              <div className="skeleton" style={{ height: 12, width: '85%' }} />
            </div>
            <div className="hotel-card__aside">
              <div className="skeleton" style={{ height: 22, width: '70%' }} />
              <div className="skeleton" style={{ height: 30, width: '100%', marginTop: 'auto' }} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
