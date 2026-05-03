import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NewTripModal from '../components/NewTripModal';
import TripCard from '../components/TripCard';
import TripFilters from '../components/TripFilters';
import TripStats from '../components/TripStats';
import TripsHeader from '../components/TripsHeader';
import { closeCreateModal, setFilter, createTrip, fetchTrips, joinTrip } from '../store/tripsSlice';

export default function GroupTripsPage() {
  const dispatch = useDispatch();
  const tripList = useSelector((state) => state.trips.tripList) || [];
  const filter = useSelector((state) => state.trips.filter);
  const isCreateModalOpen = useSelector((state) => state.trips.isCreateModalOpen);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  const handleCreateTrip = (trip) => {
    dispatch(createTrip(trip));
    dispatch(setFilter('all'));
  };

  const handleJoinTrip = async (joinedTripId) => {
    await dispatch(joinTrip(joinedTripId)).unwrap();
  };

  const trips = filter === 'all' ? tripList : tripList.filter((trip) => trip.type === filter);
  const totalSpent = tripList.reduce((sum, trip) => sum + trip.spent, 0);
  const averageSpent = tripList.length ? totalSpent / tripList.length : 0;

  return (
    <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden'>
      <Link
        to='/'
        className='inline-flex items-center text-sm sm:text-lg text-emerald-500 hover:underline mb-5 sm:mb-6'
      >
        Back to dashboard
      </Link>

      <TripsHeader />
      <TripStats tripCount={tripList.length} totalSpent={totalSpent} averageSpent={averageSpent} />
      <TripFilters activeFilter={filter} onFilterChange={(value) => dispatch(setFilter(value))} />

      <div className='grid lg:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10'>
        {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
      </div>

      {isCreateModalOpen && (
        <NewTripModal
          onClose={() => dispatch(closeCreateModal())}
          onCreate={handleCreateTrip}
          onJoin={handleJoinTrip}
        />
      )}
    </div>
  );
}
