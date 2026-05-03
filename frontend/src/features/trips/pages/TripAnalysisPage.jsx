import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, fetchTripById } from '../store/tripsSlice';
import { formatMoney } from '../utils/formatMoney';
import { calculateTripAnalysis } from '../utils/calculateTripAnalysis';

function StatBlock({ label, value, tone = 'dark:text-white text-black' }) {
  return (
    <div className='dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
      <p className='text-sm sm:text-lg dark:text-zinc-400 text-gray-500'>{label}</p>
      <p className={`text-2xl sm:text-4xl font-bold mt-3 break-words ${tone}`}>{value}</p>
    </div>
  );
}

export default function TripAnalysisPage() {
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

  useEffect(() => {
    if (tripId && !trip) {
      dispatch(fetchTripById(tripId));
    }
  }, [dispatch, trip, tripId]);

  useEffect(() => {
    if (tripId) {
      dispatch(fetchExpenses(tripId));
    }
  }, [dispatch, tripId]);

  const analysis = useMemo(
    () => calculateTripAnalysis(trip, expenses),
    [trip, expenses],
  );

  const currentUserId = currentUser?._id || currentUser?.id;
  const currentUserSummary = analysis.memberSummaries.find(
    (entry) => entry.memberId === currentUserId,
  );
  const outgoingSettlements = analysis.settlements.filter(
    (entry) => entry.fromId === currentUserId,
  );
  const incomingSettlements = analysis.settlements.filter(
    (entry) => entry.toId === currentUserId,
  );

  if (isLoading && !trip) {
    return (
      <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden flex items-center justify-center'>
        <p className='text-lg sm:text-2xl dark:text-zinc-400 text-gray-500'>Loading analysis...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b dark:border-zinc-700 border-gray-300 pb-6'>
          <h1 className='text-3xl sm:text-5xl font-bold'>Trip Analysis</h1>
          <Link className='text-lg sm:text-2xl text-emerald-500 hover:underline' to='/group-trips'>
            Back to trips
          </Link>
        </div>
        <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-10'>Trip not found.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen dark:bg-black bg-white dark:text-white text-black px-4 py-6 sm:px-8 md:px-10 md:py-10 overflow-x-hidden'>
      <div className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between border-b dark:border-zinc-700 border-gray-300 pb-6'>
        <div>
          <Link className='text-lg sm:text-2xl text-emerald-500 hover:underline' to={`/group-trips/${tripId}`}>
            Back to trip
          </Link>
          <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold mt-3 sm:mt-4 break-words'>{trip.title} Analysis</h1>
          <p className='text-lg sm:text-2xl dark:text-zinc-300 text-gray-600 mt-2 sm:mt-3'>{trip.date}</p>
        </div>
      </div>

      <div className='grid md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10'>
        <StatBlock label='Amount Owed Per Person' value={formatMoney(analysis.equalShare)} />
        <StatBlock label='Members' value={`${trip.members?.length || 0}`} />
        <StatBlock label='Trip Total Spent' value={formatMoney(analysis.totalSpent)} />
      </div>

      {currentUserSummary && (
        <div className='grid md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6'>
          <StatBlock label='You Paid' value={formatMoney(currentUserSummary.contribution)} tone='text-emerald-500' />
          <StatBlock
            label={currentUserSummary.balance >= 0 ? 'You Will Get Back' : 'You Need To Pay'}
            value={formatMoney(Math.abs(currentUserSummary.balance))}
            tone={currentUserSummary.balance >= 0 ? 'text-emerald-500' : 'text-orange-400'}
          />
          <StatBlock label='Your Fair Share' value={formatMoney(currentUserSummary.share)} />
        </div>
      )}

      <div className='grid lg:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10'>
        <div className='dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
          <h2 className='text-2xl sm:text-4xl font-bold'>Member Breakdown</h2>
          <div className='mt-6 space-y-4'>
            {analysis.memberSummaries.map((entry) => (
              <div key={entry.memberId} className='dark:bg-zinc-800 bg-gray-100 rounded-2xl p-4 sm:p-5'>
                <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-lg sm:text-2xl font-semibold break-words'>{entry.member.name}</p>
                    <p className='text-sm dark:text-zinc-400 text-gray-500'>{entry.member.email}</p>
                  </div>
                  <p className={`text-lg sm:text-2xl font-bold break-words ${entry.balance >= 0 ? 'text-emerald-500' : 'text-orange-400'}`}>
                    {entry.balance >= 0 ? '+' : '-'}{formatMoney(Math.abs(entry.balance))}
                  </p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 text-sm sm:text-lg dark:text-zinc-300 text-gray-600'>
                  <p>Paid: {formatMoney(entry.contribution)}</p>
                  <p>Share: {formatMoney(entry.share)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-6'>
          <div className='dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
            <h2 className='text-2xl sm:text-4xl font-bold'>You Need To Pay</h2>
            {outgoingSettlements.length ? (
              <div className='mt-6 space-y-3'>
                {outgoingSettlements.map((entry, index) => (
                  <div key={`${entry.fromId}-${entry.toId}-${index}`} className='dark:bg-zinc-800 bg-gray-100 rounded-2xl p-4'>
                    <p className='text-base sm:text-2xl break-words'>Pay <span className='font-semibold dark:text-white text-black'>{entry.to.name}</span> {formatMoney(entry.amount)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-base sm:text-xl dark:text-zinc-400 text-gray-500 mt-6'>You do not owe anyone.</p>
            )}
          </div>

          <div className='dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
            <h2 className='text-2xl sm:text-4xl font-bold'>You Will Receive</h2>
            {incomingSettlements.length ? (
              <div className='mt-6 space-y-3'>
                {incomingSettlements.map((entry, index) => (
                  <div key={`${entry.toId}-${entry.fromId}-${index}`} className='dark:bg-zinc-800 bg-gray-100 rounded-2xl p-4'>
                    <p className='text-base sm:text-2xl break-words'>Get <span className='font-semibold dark:text-white text-black'>{formatMoney(entry.amount)}</span> from {entry.from.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-base sm:text-xl dark:text-zinc-400 text-gray-500 mt-6'>No one owes you money.</p>
            )}
          </div>

          <div className='dark:bg-zinc-900 bg-white dark:border-zinc-700 border-gray-300 rounded-3xl p-4 sm:p-6'>
            <h2 className='text-2xl sm:text-4xl font-bold'>All Settlements</h2>
            {analysis.settlements.length ? (
              <div className='mt-6 space-y-3'>
                {analysis.settlements.map((entry, index) => (
                  <div key={`${entry.fromId}-${entry.toId}-${index}`} className='dark:bg-zinc-800 bg-gray-100 rounded-2xl p-4'>
                    <p className='text-sm sm:text-xl break-words'>
                      <span className='font-semibold dark:text-white text-black'>{entry.from.name}</span> pays{' '}
                      <span className='font-semibold dark:text-white text-black'>{entry.to.name}</span> {formatMoney(entry.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-base sm:text-xl dark:text-zinc-400 text-gray-500 mt-6'>Everything is already balanced.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
