import { Navigate, Route, Routes } from 'react-router-dom';
import TripDetailPage from '../features/trips/pages/TripDetailPage';
import TripsPage from '../features/trips/pages/TripsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<TripsPage />} />
      <Route path='/trip/:tripId' element={<TripDetailPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
