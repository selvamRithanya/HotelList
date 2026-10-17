import { useState } from 'react';
import Icon from '../common/Icon';

// fails to load
export default function HotelImage({ src, alt, className = '', loading = 'lazy', ...rest }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <div className={`hotel-image-fallback ${className}`} role="img" aria-label={alt}>
        <Icon name="image" size={32} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  );
}
