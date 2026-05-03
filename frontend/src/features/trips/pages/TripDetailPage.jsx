import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { formatMoney } from '../utils/formatMoney';
import { addExpense, removeExpense, fetchExpenses, fetchTripById } from '../store/tripsSlice';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const dispatch = useDispatch();
  const tripList = useSelector((state) => state.trips.tripList);
  const expensesByTripId = useSelector((state) => state.trips.expensesByTripId);
  const isLoading = useSelector((state) => state.trips.isLoading);
  const currentUser = useSelector((state) => state.user.currentUser);

  const trip = useMemo(
    () => tripList.find((candidate) => candidate._id === tripId || candidate.id === tripId),
    [tripId, tripList],
  );
  const expenses = useMemo(
    () => expensesByTripId[tripId] || [],
    [tripId, expensesByTripId],
  );

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (tripId && !trip) {
      dispatch(fetchTripById(tripId));
    }
  }, [dispatch, trip, tripId]);

  useEffect(() => {
    if (tripId && trip) {
      dispatch(fetchExpenses(tripId));
    }
  }, [tripId, trip, dispatch]);

  if (isLoading) {
    return (
      <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden flex items-center justify-center'>
        <p className='text-lg sm:text-2xl dark:text-zinc-400 text-gray-500'>Loading...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b dark:border-zinc-700 border-gray-300 pb-6'>
          <h1 className='text-3xl sm:text-5xl font-bold'>Trip</h1>
          <Link className='text-lg sm:text-2xl text-emerald-500 hover:underline' to='/group-trips'>
            Back to trips
          </Link>
        </div>
        <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-10'>Trip not found.</p>
      </div>
    );
  }

  const handleAdd = (event) => {
    event.preventDefault();
    dispatch(addExpense({ tripId, expenseInput: { description, amount } }));
    setDescription('');
    setAmount('');
  };

  return (
    <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden'>
      <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between border-b dark:border-zinc-700 border-gray-300 pb-6'>
        <div>
          <Link className='text-lg sm:text-2xl text-emerald-500 hover:underline' to='/group-trips'>
            Back
          </Link>
          <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold mt-3 sm:mt-4 break-words'>{trip.title}</h1>
          <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-2 sm:mt-3'>{trip.date}</p>
          <p className='text-sm sm:text-xl dark:text-zinc-500 text-gray-400 mt-3 sm:mt-4 break-all'>Trip ID: {trip._id}</p>
        </div>

        <div className='w-full sm:min-w-[260px] sm:w-auto dark:bg-zinc-900 bg-gray-100 dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
          <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600'>Budget</p>
          <p className='text-2xl sm:text-4xl font-bold mt-2 break-words'>{formatMoney(trip.budget)}</p>
          <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-4 sm:mt-5'>Spent</p>
          <p className='text-2xl sm:text-4xl font-bold mt-2 break-words'>{formatMoney(trip.spent)}</p>
          <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-4 sm:mt-5'>Status</p>
          <p className='text-xl sm:text-3xl font-semibold mt-2'>{trip.status}</p>
          <Link
            to={`/group-trips/${tripId}/analysis`}
            className='mt-5 sm:mt-6 inline-flex w-full sm:w-auto justify-center px-5 py-3 rounded-2xl bg-emerald-500 text-black text-base sm:text-xl font-semibold hover:bg-emerald-400 transition'
          >
            View Analysis
          </Link>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10'>
        <div className='lg:col-span-1 dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
          <h2 className='text-2xl sm:text-4xl font-bold'>Add Expense</h2>
          <form className='mt-6 space-y-4' onSubmit={handleAdd}>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder='Description'
              className='w-full p-4 rounded-2xl dark:bg-zinc-800 bg-gray-100 dark:text-white text-black border dark:border-zinc-700 border-gray-300 text-base sm:text-lg'
            />
            <input
              type='number'
              min='0'
              inputMode='decimal'
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder='Amount'
              className='w-full p-4 rounded-2xl dark:bg-zinc-800 bg-gray-100 dark:text-white text-black border dark:border-zinc-700 border-gray-300 text-base sm:text-lg'
            />
            <button className='w-full p-4 rounded-2xl bg-emerald-500 text-black text-base sm:text-lg font-semibold'>
              Add
            </button>
          </form>
        </div>

        <div className='lg:col-span-2 dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
          <div className='mb-8'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
              <h2 className='text-2xl sm:text-4xl font-bold'>Members</h2>
              <p className='text-base sm:text-2xl dark:text-zinc-300 text-gray-600'>{trip.members?.length || 0} joined</p>
            </div>

            {trip.members?.length ? (
              <div className='mt-6 flex flex-wrap gap-3'>
                {trip.members.map((member) => (
                  <div
                    key={member._id || member.id || member.email}
                    className='px-4 py-3 rounded-2xl dark:bg-zinc-800 bg-gray-100 dark:border-zinc-700 border-gray-300 max-w-full'
                  >
                    <p className='text-base sm:text-xl font-semibold break-words'>{member.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-6'>No members yet.</p>
            )}
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
            <h2 className='text-2xl sm:text-4xl font-bold'>Expenses</h2>
            <p className='text-base sm:text-2xl dark:text-zinc-300 text-gray-600'>{expenses.length} items</p>
          </div>

          {expenses.length === 0 ? (
            <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-8'>No expenses yet.</p>
          ) : (
            <div className='mt-8 space-y-4'>
              {expenses.map((expense) => (
                <div
                  key={expense._id || expense.id}
                  className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:bg-zinc-800 bg-gray-100 rounded-2xl p-4 sm:p-5'
                >
                  <div>
                    <p className='text-xl sm:text-3xl font-semibold break-words'>{expense.description}</p>
                    <p className='text-sm sm:text-lg text-emerald-500 mt-1 break-words'>by {expense.createdBy?.name || 'Unknown user'}</p>
                    <p className='text-sm sm:text-xl dark:text-zinc-400 text-gray-500 mt-1'>
                      {new Date(expense.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
                    <p className='text-xl sm:text-3xl font-bold'>{formatMoney(expense.amount)}</p>
                    {(expense.createdBy?._id || expense.createdBy?.id) === (currentUser?._id || currentUser?.id) && (
                      <button
                        onClick={() => dispatch(removeExpense({ tripId, expenseId: expense._id || expense.id }))}
                        className='px-4 sm:px-5 py-3 rounded-2xl border dark:border-zinc-600 border-gray-400 text-base sm:text-2xl dark:hover:bg-zinc-700 hover:bg-gray-200'
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
