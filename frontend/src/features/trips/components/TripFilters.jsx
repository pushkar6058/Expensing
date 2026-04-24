import { TRIP_FILTERS } from '../constants/tripFilters';

export default function TripFilters({ activeFilter, onFilterChange }) {
  return (
    <div className='flex flex-wrap gap-4 mt-10'>
      {TRIP_FILTERS.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-8 py-4 rounded-2xl border text-3xl ${activeFilter === key ? 'border-emerald-500 text-emerald-400' : 'border-white text-white'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
