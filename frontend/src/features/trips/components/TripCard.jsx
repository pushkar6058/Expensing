import { Link } from 'react-router-dom';
import { formatMoney } from '../utils/formatMoney';

export default function TripCard({ trip }) {
  const pct = Math.min(100, Math.round((trip.spent / trip.budget) * 100));
  const memberCount = trip.members?.length || 0;

  return (
    <div className='bg-zinc-800 rounded-3xl p-5 sm:p-8 border border-zinc-700 min-h-[290px] flex flex-col overflow-hidden'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='min-w-0'>
          <Link
            to={`/group-trips/${trip._id}`}
            className='block text-2xl sm:text-4xl font-semibold leading-tight hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded break-words'
          >
            {trip.title}
          </Link>
          <p className='text-zinc-300 text-base sm:text-2xl mt-2 break-words'>{trip.date}</p>
        </div>

        <span className={`self-start px-4 sm:px-5 py-2 rounded-xl text-sm sm:text-xl text-black ${trip.color}`}>{trip.status}</span>
      </div>

      <div className='flex flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-6'>
        {trip.tag1 && <span className='px-3 sm:px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm sm:text-xl max-w-full break-words'>{trip.tag1}</span>}
        <span className='px-3 sm:px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm sm:text-xl'>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
      </div>

      <div className='mt-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-base sm:text-2xl text-zinc-300 mt-6 sm:mt-8'>
          <span className='break-words'>{formatMoney(trip.spent)} spent</span>
          <span className='break-words sm:text-right'>{formatMoney(trip.budget)} budget</span>
        </div>

        <div className='h-4 rounded-full bg-zinc-900 mt-5 overflow-hidden'>
          <div className={`h-full ${trip.bar}`} style={{ width: `${pct}%` }} />
        </div>

        <p className={`text-base sm:text-2xl mt-4 break-words ${trip.bar.includes('orange') ? 'text-orange-400' : 'text-zinc-200'}`}>{trip.text}</p>
      </div>
    </div>
  );
}
