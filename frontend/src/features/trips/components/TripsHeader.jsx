import { Plus } from 'lucide-react';

export default function TripsHeader({ userName, onCreateTrip }) {
  return (
    <div className='flex flex-wrap gap-6 items-start justify-between border-b border-zinc-700 pb-8'>
      <div>
        <p className='text-3xl text-zinc-200 font-medium'>Good morning, {userName}</p>
        <h1 className='text-6xl font-bold mt-2'>My Trips</h1>
      </div>

      <div className='flex items-center gap-5'>
        <button
          onClick={onCreateTrip}
          className='px-8 py-5 rounded-2xl border-2 border-white text-3xl font-semibold flex items-center gap-3 hover:bg-white hover:text-black transition'
        >
          <Plus size={28} />
          New Trip
        </button>

        <div className='w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl font-semibold'>
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
