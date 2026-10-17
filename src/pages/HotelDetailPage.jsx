import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Seo from '../components/common/Seo';
import Icon from '../components/common/Icon';
import Spinner, { PageLoader } from '../components/common/Spinner';
import StateMessage from '../components/common/StateMessage';
import PageHeader from '../components/layout/PageHeader';
import HotelImage from '../components/hotels/HotelImage';
import HotelMap from '../components/hotels/HotelMap';
import DeleteHotelDialog from '../components/hotels/DeleteHotelDialog';
import { fetchHotelById, selectCurrentHotel, selectHotelFromList } from '../features/hotels/hotelsSlice';
import { useGeolocation } from '../hooks/useGeolocation';
import { useHotelDelete } from '../hooks/useHotelDelete';
import { absoluteUrl, assetUrl } from '../api/client';
import { distanceInKm } from '../utils/geo';
import { formatCoordinates, formatDate, formatDistance, formatPrice, truncate } from '../utils/format';
import './HotelDetailPage.css';

function LocationStatus({ geo, distanceKm }) {
  if (geo.status === 'locating') {
    return (
      <p className="geo-status">
        <Spinner size="sm" /> Finding your location…
      </p>
    );
  }
  if (geo.status === 'success') {
    return (
      <p className="geo-status geo-status--success">
        <Icon name="navigation" size={14} />
        You are about <strong>{formatDistance(distanceKm)}</strong> away
      </p>
    );
  }
  if (geo.error) {
    return (
      <p className="geo-status">
        <Icon name="info" size={14} />
        {geo.error} Showing the hotel location only.
      </p>
    );
  }
  return null;
}

export default function HotelDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector(selectCurrentHotel);
  const cached = useSelector((state) => selectHotelFromList(state, id));
  const geo = useGeolocation({ auto: true });
  const { requestDelete, dialogProps } = useHotelDelete({
    onDeleted: () => navigate('/hotels', { replace: true }),
  });

  useEffect(() => {
    const request = dispatch(fetchHotelById(id));
    return () => request.abort();
  }, [dispatch, id]);

  const isCurrent = current.id === id;
  
  const hotel = (isCurrent && current.item) || cached;

  if (!hotel) {
    if (isCurrent && current.status === 'failed') {
      const notFound = [400, 404].includes(current.error?.status);
      return (
        <>
          <Seo title={notFound ? 'Hotel not found' : 'Something went wrong'} noIndex />
          <div className="container">
            <StateMessage
              icon="alert"
              tone="danger"
              title={notFound ? 'Hotel not found' : 'Couldn’t load this hotel'}
              message={notFound ? 'It may have been deleted or the link is incorrect.' : current.error?.message}
            >
              {!notFound && (
                <button type="button" className="btn btn--primary" onClick={() => dispatch(fetchHotelById(id))}>
                  Try again
                </button>
              )}
              <Link to="/hotels" className="btn btn--secondary">Back to hotels</Link>
            </StateMessage>
          </div>
        </>
      );
    }
    return <PageLoader label="Loading hotel…" />;
  }

  const position = [hotel.latitude, hotel.longitude];
  const userPosition = geo.position ? [geo.position.lat, geo.position.lng] : null;
  const distanceKm = geo.position ? distanceInKm(geo.position, { lat: hotel.latitude, lng: hotel.longitude }) : null;
  const imageUrl = assetUrl(hotel.image_path);
  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}` +
    (geo.position ? `&origin=${geo.position.lat},${geo.position.lng}` : '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.title,
    description: hotel.description,
    image: imageUrl ? absoluteUrl(imageUrl) : undefined,
    url: absoluteUrl(`/hotels/${hotel.id}`),
    priceRange: formatPrice(hotel.price),
    geo: { '@type': 'GeoCoordinates', latitude: hotel.latitude, longitude: hotel.longitude },
  };

  return (
    <>
      <Seo
        title={hotel.title}
        description={truncate(hotel.description, 155)}
        image={imageUrl}
        type="article"
        jsonLd={jsonLd}
      />
      <PageHeader
        title={hotel.title}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Hotels', to: '/hotels' }, { label: hotel.title }]}
        actions={
          <Link to="/hotels" className="btn btn--light btn--sm">
            <Icon name="arrowLeft" size={14} />
            All hotels
          </Link>
        }
      />

      <div className="container detail">
        <div className="detail__grid">
          <article className="card detail__main">
            <figure className="detail__figure">
              <HotelImage src={imageUrl} alt={`Photo of ${hotel.title}`} loading="eager" fetchPriority="high" />
            </figure>
            <div className="detail__content">
              <h2 className="detail__heading">About this hotel</h2>
              <p className="detail__description">{hotel.description}</p>
            </div>
          </article>

          <aside className="card detail__summary" aria-label="Summary">
            <div className="detail__pricing">
              <p className="detail__price-label">Price per night</p>
              <p className="detail__price">{formatPrice(hotel.price)}</p>
            </div>
            <dl className="detail__facts">
              <div>
                <dt>Location</dt>
                <dd>{formatCoordinates(hotel.latitude, hotel.longitude)}</dd>
              </div>
              <div>
                <dt>Listed on</dt>
                <dd>{formatDate(hotel.created_at)}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatDate(hotel.updated_at)}</dd>
              </div>
            </dl>
            <div className="detail__actions">
              <Link to={`/hotels/${hotel.id}/edit`} className="btn btn--outline">
                <Icon name="edit" size={14} />
                Edit
              </Link>
              <button type="button" className="btn btn--danger-outline" onClick={() => requestDelete(hotel)}>
                <Icon name="trash" size={14} />
                Delete
              </button>
            </div>
            <a className="btn btn--cta btn--block" href={directionsUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="navigation" size={14} />
              Get directions
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </aside>
        </div>

        <section className="card detail__location" aria-labelledby="location-heading">
          <div className="detail__location-header">
            <h2 id="location-heading" className="detail__heading">Location</h2>
            <div className="detail__location-status">
              <LocationStatus geo={geo} distanceKm={distanceKm} />
              {geo.supported && geo.status !== 'locating' && geo.status !== 'success' && (
                <button type="button" className="btn btn--secondary btn--sm" onClick={() => geo.locate().catch(() => {})}>
                  <Icon name="crosshair" size={14} />
                  Show my location
                </button>
              )}
            </div>
          </div>
          <HotelMap
            className="detail__map"
            position={position}
            userPosition={userPosition}
            title={hotel.title}
            label={`Map showing the location of ${hotel.title}`}
          />
        </section>
      </div>

      <DeleteHotelDialog {...dialogProps} />
    </>
  );
}
