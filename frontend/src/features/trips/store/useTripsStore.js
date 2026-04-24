import { useContext } from 'react';
import TripsContext from './TripsContext';

export default function useTripsStore() {
  const store = useContext(TripsContext);
  if (!store) throw new Error('useTripsStore must be used within <TripsProvider />');
  return store;
}
