import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Fallback } from '../fallback/Fallback';

const TripDetailPage = lazy(() => import('../features/trips/pages/TripDetailPage'));
const TripAnalysisPage = lazy(() => import('../features/trips/pages/TripAnalysisPage'));
const UserAuth = lazy(() => import('../features/auth/pages/UserAuth'));
const ProtectedRoute = lazy(() => import('../features/auth/components/ProtectedRoute'));
const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const GroupTripsPage = lazy(() => import('../features/trips/pages/GroupTripsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Fallback />}>
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
    </Suspense>
  );
}
