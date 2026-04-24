import { Navigate, Route, Routes } from 'react-router-dom';
import TripDetailPage from '../features/trips/pages/TripDetailPage';
import TripAnalysisPage from '../features/trips/pages/TripAnalysisPage';
import UserAuth from '../features/auth/pages/UserAuth';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import HomePage from '../features/home/pages/HomePage';
import GroupTripsPage from '../features/trips/pages/GroupTripsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/auth' element={<UserAuth />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/group-trips' element={<GroupTripsPage />} />
        <Route path='/group-trips/:tripId' element={<TripDetailPage />} />
        <Route path='/group-trips/:tripId/analysis' element={<TripAnalysisPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
