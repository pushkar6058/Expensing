import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, User, Plane, Calendar } from 'lucide-react';
import TripsHeader from '../../trips/components/TripsHeader';
import { logout } from '../../auth/store/userSlice';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const options = [
  {
    id: 'group-trips',
    title: 'Group Trips',
    description: 'Track expenses with friends and family',
    icon: Users,
    color: 'bg-emerald-500',
    path: '/group-trips',
  },
  {
    id: 'solo-trips',
    title: 'Solo Trips',
    description: 'Personal travel expenses',
    icon: Plane,
    color: 'bg-blue-500',
    path: '/solo-trips',
    disabled: true,
  },
  {
    id: 'personal-expense',
    title: 'Personal Expense',
    description: 'Day-to-day expenses',
    icon: User,
    color: 'bg-purple-500',
    path: '/personal-expense',
    disabled: true,
  },
  {
    id: 'monthly-expense',
    title: 'Monthly Expense',
    description: 'Recurring monthly tracking',
    icon: Calendar,
    color: 'bg-orange-500',
    path: '/monthly-expense',
    disabled: true,
  },
];

export default function HomePage() {
  const hour = new Date().getHours();
  const dispatch = useDispatch();
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
    <>

<div className='flex flex-col min-h-screen dark:bg-black bg-white dark:text-white text-black p-10 md:p-14'>
      <p className='text-lg sm:text-3xl dark:text-zinc-200 text-gray-700 font-medium break-words'>{hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'}, {currentUser?.name}</p>
<div className='flex justify-end gap-3'>
            <button
             onClick={handleLogout}
             className='px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 dark:border-zinc-600 border-gray-400 dark:text-white text-black text-sm sm:text-xl font-semibold dark:hover:bg-zinc-800 hover:bg-gray-200 transition'
           >
             Logout
           </button>
         </div>
       
      <br />

      <div className='grid md:grid-cols-2 gap-6 max-w-4xl'>
        {options.map((option) => {
          const Icon = option.icon;

          return (
            <Link
              key={option.id}
              to={option.disabled ? '#' : option.path}
              onClick={(event) => {
                if (option.disabled) event.preventDefault();
              }}
              className={`block p-8 rounded-3xl border dark:border-zinc-700 border-gray-300 dark:bg-zinc-900 bg-gray-100 dark:hover:bg-zinc-800 hover:bg-gray-200 transition-all ${
                option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500'
              }`}
            >
              <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center mb-5`}>
                <Icon size={32} className='text-black' />
              </div>
              <h2 className='text-3xl font-bold mb-2 dark:text-white text-black'>{option.title}</h2>
              <p className='text-lg dark:text-zinc-400 text-gray-500'>{option.description}</p>
              {option.disabled && (
                <span className='inline-block mt-3 px-3 py-1 dark:bg-zinc-700 bg-gray-200 dark:text-zinc-400 text-gray-600 rounded-full text-sm'>
                  Coming soon
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
    </>
  );
}
