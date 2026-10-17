import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';

const HotelListPage = lazy(() => import('./pages/HotelListPage'));
const HotelDetailPage = lazy(() => import('./pages/HotelDetailPage'));
const HotelFormPage = lazy(() => import('./pages/HotelFormPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/hotels" replace />} />
        <Route path="hotels" element={<HotelListPage />} />
        <Route path="hotels/new" element={<HotelFormPage />} />
        <Route path="hotels/:id" element={<HotelDetailPage />} />
        <Route path="hotels/:id/edit" element={<HotelFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
