import { useMemo, useState } from 'react';
import FormField, { describedBy } from '../common/FormField';
import Icon from '../common/Icon';
import Spinner from '../common/Spinner';
import ImageUpload from './ImageUpload';
import HotelMap from './HotelMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { assetUrl } from '../../api/client';
import { currencySymbol } from '../../utils/format';
import { parseCoordinates, roundCoordinate } from '../../utils/geo';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, validateHotel } from '../../utils/validation';
import './HotelForm.css';

const FIELD_ORDER = ['image', 'title', 'description', 'latitude', 'longitude', 'price'];
const TEXT_FIELDS = ['title', 'description', 'latitude', 'longitude', 'price'];
const inputId = (name) => `hotel-${name}`;

function toFormValues(hotel) {
  if (!hotel) return { title: '', description: '', latitude: '', longitude: '', price: '' };
  return {
    title: hotel.title,
    description: hotel.description,
    latitude: String(hotel.latitude),
    longitude: String(hotel.longitude),
    price: String(hotel.price),
  };
}

function toFieldErrors(details) {
  if (!Array.isArray(details)) return {};
  return details.reduce((acc, { field, message }) => {
    if (field && !acc[field]) acc[field] = message;
    return acc;
  }, {});
}

export default function HotelForm({ hotel, onSubmit, onCancel, submitLabel = 'Save' }) {
  const isEdit = Boolean(hotel);
  const initialValues = useMemo(() => toFormValues(hotel), [hotel]);
  const [values, setValues] = useState(initialValues);
  const [image, setImage] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const geo = useGeolocation();
  const errors = useMemo(() => validateHotel(values, { image, imageRequired: !isEdit }), [values, image, isEdit]);
  const isDirty = Boolean(image) || TEXT_FIELDS.some((name) => values[name] !== initialValues[name]);
  const coordinates = parseCoordinates(values.latitude, values.longitude);
  const errorFor = (name) => serverErrors[name] || ((touched[name] || submitAttempted) ? errors[name] : undefined);
  const clearServerError = (name) =>
    setServerErrors((current) => {
      if (!current[name]) return current;
      const { [name]: _removed, ...rest } = current;
      return rest;
    });
  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    clearServerError(name);
  };
  const inputProps = (name) => {
    const id = inputId(name);
    const error = errorFor(name);
    return {
      id,
      name,
      value: values[name],
      onChange: (event) => setField(name, event.target.value),
      onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
      'aria-invalid': Boolean(error),
      'aria-describedby': describedBy(id, error),
      'aria-required': true,
    };
  };
  const handleImageChange = (file) => {
    setImage(file);
    setTouched((current) => ({ ...current, image: true }));
    clearServerError('image');
  };
  const setCoordinates = ({ lat, lng }) => {
    setField('latitude', roundCoordinate(lat));
    setField('longitude', roundCoordinate(lng));
    setTouched((current) => ({ ...current, latitude: true, longitude: true }));
  };
  const fillCurrentLocation = () => {
    geo.locate().then(setCoordinates).catch(() => {});
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setFormError('');
    const firstInvalid = FIELD_ORDER.find((name) => errors[name]);
    if (firstInvalid) {
      document.getElementById(inputId(firstInvalid))?.focus();
      return;
    }
    const formData = new FormData();
    TEXT_FIELDS.forEach((name) => formData.append(name, values[name].trim()));
    if (image) formData.append('image', image);
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setServerErrors(toFieldErrors(err?.details));
      setFormError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const titleLength = values.title.trim().length;
  const descriptionLength = values.description.trim().length;
  return (
    <form className="hotel-form" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      {formError && (
        <div className="alert-banner" role="alert">
          <Icon name="alert" size={18} />
          <div>
            <strong>{formError}</strong>
            {Object.keys(serverErrors).length > 0 && <p>Please correct the highlighted fields.</p>}
          </div>
        </div>
      )}
      <section className="card form-section" aria-labelledby="section-photo">
        <header className="form-section__header">
          <h2 id="section-photo">Photo</h2>
          <p>A clear photo of the hotel helps guests decide.</p>
        </header>
        <FormField id={inputId('image')} label="Hotel image" required={!isEdit} error={errorFor('image')}>
          <ImageUpload
            id={inputId('image')}
            file={image}
            existingUrl={hotel ? assetUrl(hotel.image_path) : null}
            onChange={handleImageChange}
            error={errorFor('image')}
            describedBy={describedBy(inputId('image'), errorFor('image'))}
            previewAlt={values.title.trim() ? `Preview of ${values.title.trim()}` : 'Preview of the hotel image'}
          />
        </FormField>
      </section>
      <section className="card form-section" aria-labelledby="section-details">
        <header className="form-section__header">
          <h2 id="section-details">Details</h2>
        </header>
        <div className="form-grid">
          <FormField
            id={inputId('title')}
            label="Title"
            required
            error={errorFor('title')}
            counter={`${titleLength}/${MAX_TITLE_LENGTH}`}
          >
            <input {...inputProps('title')} type="text" className="input" placeholder="e.g. Sea View Resort" autoComplete="off" />
          </FormField>

          <FormField
            id={inputId('description')}
            label="Description"
            required
            error={errorFor('description')}
            counter={`${descriptionLength}/${MAX_DESCRIPTION_LENGTH}`}
          >
            <textarea
              {...inputProps('description')}
              className="textarea"
              rows={6}
              placeholder="Describe the rooms, amenities and surroundings…"
            />
          </FormField>
        </div>
      </section>

      <section className="card form-section" aria-labelledby="section-location">
        <header className="form-section__header">
          <h2 id="section-location">Location</h2>
          <p>Enter coordinates, use your current location, or click on the map.</p>
        </header>
        <div className="form-grid form-grid--2">
          <FormField id={inputId('latitude')} label="Latitude" required error={errorFor('latitude')}>
            <input {...inputProps('latitude')} type="number" className="input" step="any" min="-90" max="90" inputMode="decimal" placeholder="e.g. 13.0827" />
          </FormField>
          <FormField id={inputId('longitude')} label="Longitude" required error={errorFor('longitude')}>
            <input {...inputProps('longitude')} type="number" className="input" step="any" min="-180" max="180" inputMode="decimal" placeholder="e.g. 80.2707" />
          </FormField>
        </div>

        <div className="location-tools">
          <button
            type="button"
            className="btn btn--secondary btn--sm"
            onClick={fillCurrentLocation}
            disabled={!geo.supported || geo.status === 'locating'}
          >
            {geo.status === 'locating' ? <Spinner size="sm" /> : <Icon name="crosshair" size={14} />}
            Use my current location
          </button>
          {geo.error && <span className="field__error" role="status">{geo.error}</span>}
        </div>
        <HotelMap
          className="location-picker"
          position={coordinates}
          title={values.title.trim() || undefined}
          onPick={setCoordinates}
          label="Map: click to set the hotel location"
        />
      </section>
      <section className="card form-section" aria-labelledby="section-pricing">
        <header className="form-section__header">
          <h2 id="section-pricing">Pricing</h2>
        </header>
        <FormField id={inputId('price')} label="Price per night" required error={errorFor('price')} hint="Up to 2 decimal places">
          <div className="input-group input-group--prefix">
            <span className="input-group__prefix" aria-hidden="true">{currencySymbol}</span>
            <input
              {...inputProps('price')}
              aria-describedby={describedBy(inputId('price'), errorFor('price'), 'hint')}
              type="number"
              className="input"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
            />
          </div>
        </FormField>
      </section>
      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting || (isEdit && !isDirty)}>
          {submitting && <Spinner size="sm" />}
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
