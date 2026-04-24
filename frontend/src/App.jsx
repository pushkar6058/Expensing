import AppRoutes from './app/AppRoutes';
import TripsProvider from './features/trips/store/TripsProvider';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <TripsProvider>
      <AppRoutes />
      <Toaster />
    </TripsProvider>
  );
}
