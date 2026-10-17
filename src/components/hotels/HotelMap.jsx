import { useEffect } from 'react';
import { divIcon } from 'leaflet';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../config';
import './HotelMap.css';

// Custom SVG pin, so no marker image assets need to be bundled.
const hotelIcon = divIcon({
  className: 'map-pin',
  html: `<svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true">
    <path class="map-pin__body" d="M17 1C8.2 1 1 8.1 1 16.9 1 29 17 43 17 43s16-14 16-26.1C33 8.1 25.8 1 17 1z" fill="#0b63e5" stroke="#fff" stroke-width="2"/>
    <circle cx="17" cy="17" r="6" fill="#fff"/>
  </svg>`,
  iconSize: [34, 44],
  iconAnchor: [17, 43],
  popupAnchor: [0, -38],
});

// Keeps the view on the hotel, or fits both the hotel and the user when the user's position is known.
function MapViewport({ position, userPosition }) {
  const map = useMap();
  const [lat, lng] = position ?? [];
  const [userLat, userLng] = userPosition ?? [];

  useEffect(() => {
    if (lat === undefined) return;
    if (userLat !== undefined) {
      map.fitBounds([[lat, lng], [userLat, userLng]], { padding: [48, 48], maxZoom: 15 });
    } else {
      map.setView([lat, lng], Math.max(map.getZoom(), 13));
    }
  }, [map, lat, lng, userLat, userLng]);

  return null;
}

function ClickToPick({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng);
    },
  });
  return null;
}

// Map showing a hotel (and optionally the user's position).
// With `onPick`, clicking the map reports the clicked coordinates (location picker).
export default function HotelMap({ position, userPosition, title, onPick, label = 'Map', className = '' }) {
  return (
    <div className={`hotel-map ${onPick ? 'hotel-map--picker' : ''} ${className}`} role="region" aria-label={label}>
      <MapContainer
        center={position ?? DEFAULT_MAP_CENTER}
        zoom={position ? 14 : DEFAULT_MAP_ZOOM}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position} icon={hotelIcon} title={title ? `Location of ${title}` : 'Hotel location'}>
            {title && <Popup>{title}</Popup>}
          </Marker>
        )}
        {userPosition && (
          <>
            <CircleMarker
              center={userPosition}
              radius={8}
              pathOptions={{ color: '#fff', weight: 3, fillColor: '#16a34a', fillOpacity: 1 }}
            >
              <Tooltip direction="top" offset={[0, -8]}>You are here</Tooltip>
            </CircleMarker>
            {position && (
              <Polyline positions={[userPosition, position]} pathOptions={{ color: '#0b63e5', weight: 3, dashArray: '6 8', className: 'map-route' }} />
            )}
          </>
        )}
        <MapViewport position={position} userPosition={userPosition} />
        {onPick && <ClickToPick onPick={onPick} />}
      </MapContainer>
    </div>
  );
}
