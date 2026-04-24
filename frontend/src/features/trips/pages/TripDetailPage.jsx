import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatMoney } from '../utils/formatMoney';
import useTripsStore from '../store/useTripsStore';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const {
    addExpense,
    expensesByTripId,
    isLoading,
    loadExpenses,
    removeExpense,
    tripList,
  } = useTripsStore();

  const trip = useMemo(
    () => tripList.find((t) => t._id === tripId || t.id === tripId),
    [tripId, tripList],
  );
  const expenses = useMemo(
    () => expensesByTripId.get(tripId) || [],
    [tripId, expensesByTripId],
  );

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (tripId && trip) {
      loadExpenses(tripId);
    }
  }, [tripId, trip, loadExpenses]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-black text-white p-10 md:p-14 flex items-center justify-center'>
        <p className='text-2xl text-zinc-400'>Loading...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='min-h-screen bg-black text-white p-10 md:p-14'>
        <div className='flex items-center justify-between border-b border-zinc-700 pb-6'>
          <h1 className='text-5xl font-bold'>Trip</h1>
          <Link className='text-2xl text-emerald-400 hover:underline' to='/'>
            Back to trips
          </Link>
        </div>
        <p className='text-2xl text-zinc-300 mt-10'>Trip not found.</p>
      </div>
    );
  }

  const handleAdd = (e) => {
    e.preventDefault();
    addExpense(tripId, { description, amount });
    setDescription('');
    setAmount('');
  };

  return (
    <div className='min-h-screen bg-black text-white p-10 md:p-14'>
      <div className='flex flex-wrap items-start justify-between gap-6 border-b border-zinc-700 pb-6'>
        <div>
          <Link className='text-2xl text-emerald-400 hover:underline' to='/'>
            Back
          </Link>
          <h1 className='text-6xl font-bold mt-4'>{trip.title}</h1>
          <p className='text-2xl text-zinc-300 mt-3'>{trip.date}</p>
        </div>

        <div className='min-w-[260px] bg-zinc-900 border border-zinc-700 rounded-3xl p-6'>
          <p className='text-2xl text-zinc-300'>Budget</p>
          <p className='text-4xl font-bold mt-2'>{formatMoney(trip.budget)}</p>
          <p className='text-2xl text-zinc-300 mt-5'>Spent</p>
          <p className='text-4xl font-bold mt-2'>{formatMoney(trip.spent)}</p>
          <p className='text-2xl text-zinc-300 mt-5'>Status</p>
          <p className='text-3xl font-semibold mt-2'>{trip.status}</p>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-6 mt-10'>
        <div className='lg:col-span-1 bg-zinc-900 border border-zinc-700 rounded-3xl p-6'>
          <h2 className='text-4xl font-bold'>Add Expense</h2>
          <form className='mt-6 space-y-4' onSubmit={handleAdd}>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Description'
              className='w-full p-4 rounded-2xl bg-zinc-800'
            />
            <input
              type='number'
              min='0'
              inputMode='decimal'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Amount'
              className='w-full p-4 rounded-2xl bg-zinc-800'
            />
            <button className='w-full p-4 rounded-2xl bg-emerald-500 text-black'>
              Add
            </button>
          </form>
          <p className='text-xl text-zinc-400 mt-4'>Expenses update the trip spent value.</p>
        </div>

        <div className='lg:col-span-2 bg-zinc-900 border border-zinc-700 rounded-3xl p-6'>
          <div className='flex items-end justify-between gap-6'>
            <h2 className='text-4xl font-bold'>Expenses</h2>
            <p className='text-2xl text-zinc-300'>{expenses.length} items</p>
          </div>

          {expenses.length === 0 ? (
            <p className='text-2xl text-zinc-300 mt-8'>No expenses yet.</p>
          ) : (
            <div className='mt-8 space-y-4'>
              {expenses.map((expense) => (
                <div
                  key={expense._id || expense.id}
                  className='flex flex-wrap items-center justify-between gap-4 bg-zinc-800 rounded-2xl p-5'
                >
                  <div>
                    <p className='text-3xl font-semibold'>{expense.description}</p>
                    <p className='text-xl text-zinc-400 mt-1'>
                      {new Date(expense.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <p className='text-3xl font-bold'>{formatMoney(expense.amount)}</p>
                    <button
                      onClick={() => removeExpense(tripId, expense._id || expense.id)}
                      className='px-5 py-3 rounded-2xl border border-zinc-600 text-2xl hover:bg-zinc-700'
                    >
                      Delete
                    </button>
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