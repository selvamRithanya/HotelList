import { request } from './client';

export const hotelsApi = {
  list: (params, { signal } = {}) => request('/api/hotels', { query: params, signal }),
  get: (id, { signal } = {}) => request(`/api/hotels/${encodeURIComponent(id)}`, { signal }),
  create: (formData) => request('/api/hotels', { method: 'POST', body: formData }),
  update: (id, formData) => request(`/api/hotels/${encodeURIComponent(id)}`, { method: 'PUT', body: formData }),
  remove: (id, { deleteImage = true } = {}) =>
  request(`/api/hotels/${encodeURIComponent(id)}`, { method: 'DELETE', query: { deleteImage } }),
};
