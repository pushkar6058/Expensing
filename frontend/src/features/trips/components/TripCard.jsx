import { Link } from 'react-router-dom';
import { formatMoney } from '../utils/formatMoney';

export default function TripCard({ trip }) {
  const pct = Math.min(100, Math.round((trip.spent / trip.budget) * 100));

  return (
    <div className='bg-zinc-800 rounded-3xl p-8 border border-zinc-700 min-h-[290px] flex flex-col'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <Link
            to={`/trip/${trip._id}`}
            className='text-4xl font-semibold leading-tight hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded'
          >
            {trip.title}
          </Link>
          <p className='text-zinc-300 text-2xl mt-2'>{trip.date}</p>
        </div>

        <span className={`px-5 py-2 rounded-xl text-xl text-black ${trip.color}`}>{trip.status}</span>
      </div>

      <div className='flex gap-3 mt-6'>
        {trip.tag1 && <span className='px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xl'>{trip.tag1}</span>}
        <span className='px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-xl'>{trip.people}</span>
      </div>

      <div className='mt-auto'>
        <div className='flex justify-between text-2xl text-zinc-300 mt-8'>
          <span>{formatMoney(trip.spent)} spent</span>
          <span>{formatMoney(trip.budget)} budget</span>
        </div>

        <div className='h-4 rounded-full bg-zinc-900 mt-5 overflow-hidden'>
          <div className={`h-full ${trip.bar}`} style={{ width: `${pct}%` }} />
        </div>

        <p className={`text-2xl mt-4 ${trip.bar.includes('orange') ? 'text-orange-400' : 'text-zinc-200'}`}>{trip.text}</p>
      </div>
    </div>
  );
}
