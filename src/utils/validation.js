import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../config';
export const MAX_TITLE_LENGTH = 255;
export const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_PRICE = 9999999999.99;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;
const PRICE_RE = /^\d+(\.\d{1,2})?$/;
function checkCoordinate(raw, label, limit) {
  const value = String(raw ?? '').trim();
  if (!value) return `${label} is required`;
  if (!NUMBER_RE.test(value)) return `${label} must be a number`;
  if (Math.abs(Number(value)) > limit) return `${label} must be between -${limit} and ${limit}`;
  return undefined;
}
export function validateImage(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Image must be a JPEG, PNG, WEBP or GIF file';
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return `Image must be ${MAX_IMAGE_SIZE_MB} MB or smaller`;
  return undefined;
}
export function validateHotel(values, { image, imageRequired }) {
  const errors = {};
  const title = values.title.trim();
  if (!title) errors.title = 'Title is required';
  else if (title.length > MAX_TITLE_LENGTH) errors.title = `Title must be at most ${MAX_TITLE_LENGTH} characters`;
  const description = values.description.trim();
  if (!description) errors.description = 'Description is required';
  else if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  errors.latitude = checkCoordinate(values.latitude, 'Latitude', 90);
  errors.longitude = checkCoordinate(values.longitude, 'Longitude', 180);

  const price = String(values.price ?? '').trim();
  if (!price) errors.price = 'Price is required';
  else if (!NUMBER_RE.test(price) || Number(price) < 0) errors.price = 'Price must be a positive number';
  else if (!PRICE_RE.test(price)) errors.price = 'Price can have at most 2 decimal places';
  else if (Number(price) > MAX_PRICE) errors.price = 'Price is too large';
  if (image) errors.image = validateImage(image);
  else if (imageRequired) errors.image = 'Please upload an image of the hotel';

  Object.keys(errors).forEach((key) => errors[key] === undefined && delete errors[key]);
  return errors;
}

export function validatePriceRange(min, max) {
  for (const value of [min, max]) {
    if (value !== '' && (!NUMBER_RE.test(value) || Number(value) < 0)) return 'Prices must be positive numbers';
  }
  if (min !== '' && max !== '' && Number(min) > Number(max)) return 'Min price cannot be greater than max price';
  return '';
}
