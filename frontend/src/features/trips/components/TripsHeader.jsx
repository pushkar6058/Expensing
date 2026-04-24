import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { logout } from '../../auth/store/userSlice';
import { openCreateModal } from '../store/tripsSlice';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:3000/api';

export default function TripsHeader() {
  const dispatch = useDispatch();
  const hour = new Date().getHours();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
    dispatch(logout());
    toast.success('Logged out successfully');
  };

  return (
    <div className='flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between border-b border-zinc-700 pb-6 sm:pb-8'>
      <div>
        <p className='text-lg sm:text-3xl text-zinc-200 font-medium break-words'>{hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, {currentUser?.name}</p>
        <h1 className='text-4xl sm:text-6xl font-bold mt-2'>My Trips</h1>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5'>
        <button
          onClick={() => dispatch(openCreateModal())}
          className='w-full sm:w-auto px-5 sm:px-8 py-4 sm:py-5 rounded-2xl border-2 border-white text-lg sm:text-3xl font-semibold flex items-center justify-center gap-3 hover:bg-white hover:text-black transition'
        >
          <Plus size={24} />
          New Trip
        </button>

        <div className='flex items-center justify-between sm:justify-start gap-3 sm:gap-4'>
          <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xl sm:text-3xl font-semibold shrink-0'>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className='px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-zinc-600 text-sm sm:text-xl font-semibold hover:bg-zinc-800 transition'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
