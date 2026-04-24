import NewTripModal from '../components/NewTripModal';
import TripCard from '../components/TripCard';
import TripFilters from '../components/TripFilters';
import TripStats from '../components/TripStats';
import TripsHeader from '../components/TripsHeader';
import useTripsStore from '../store/useTripsStore';

const user = { name: 'Pushkar' };

export default function TripsPage() {
  
  const { closeCreateModal, filter, handleCreateTrip, isCreateModalOpen, openCreateModal, setFilter, tripList } = useTripsStore();

  const trips = filter === 'all' ? tripList : tripList.filter((trip) => trip.type === filter);
  const totalSpent = tripList.reduce((sum, trip) => sum + trip.spent, 0);
  const averageSpent = tripList.length ? totalSpent / tripList.length : 0;

  return (
    <div className='min-h-screen bg-black text-white p-10 md:p-14'>
      <TripsHeader userName={user.name} onCreateTrip={openCreateModal} />
      <TripStats tripCount={tripList.length} totalSpent={totalSpent} averageSpent={averageSpent} />
      <TripFilters activeFilter={filter} onFilterChange={setFilter} />

      <div className='grid lg:grid-cols-2 gap-6 mt-10'>
        {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
      </div>

      {isCreateModalOpen && (
        <NewTripModal onClose={closeCreateModal} onCreate={handleCreateTrip} />
      )}
    </div>
  );
}
