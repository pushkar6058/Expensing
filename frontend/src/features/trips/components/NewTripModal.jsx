import { useState } from 'react';
import { getTripPresentation } from '../utils/getTripPresentation';
import { getTripStatus } from '../utils/getTripStatus';
import toast from 'react-hot-toast';

function isValidTripDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  return startDate <= endDate;
}

function formatTripDate(startDate, endDate) {
  if (!startDate || !endDate) return 'Dates pending';

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  const startLabel = start.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  const endLabel = end.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `${startLabel} - ${endLabel}`;
}

export default function NewTripModal({ onClose, onCreate, onJoin }) {
  const [mode, setMode] = useState('menu');
  const [step, setStep] = useState(1);
  const [isJoining, setIsJoining] = useState(false);
  const [tripId, setTripId] = useState('');
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [spent, setSpent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const tripDate = formatTripDate(startDate, endDate);
  const parsedBudget = Number(budget) || 0;
  const parsedSpent = Number(spent) || 0;
  const computedStatus = getTripStatus(startDate, endDate);
  const hasValidDateRange = isValidTripDateRange(startDate, endDate);

  const canReview = Boolean(
    name.trim() &&
      budget &&
      startDate &&
      endDate &&
      hasValidDateRange,
  );

  const handleCreate = () => {
    if (!hasValidDateRange) {
      toast.error('Start date must be before or equal to end date');
      return;
    }

    const tripPresentation = getTripPresentation(computedStatus, parsedSpent, parsedBudget);

    onCreate({
      id: Date.now(),
      title: name.trim(),
      date: tripDate,
      startDate,
      endDate,
      spent: parsedSpent,
      budget: parsedBudget,
      status: computedStatus,
      ...tripPresentation,
    });

    onClose();
  };

  const handleJoinTrip = async () => {
    if (!tripId.trim()) {
      toast.error('Enter a trip id');
      return;
    }

    setIsJoining(true);

    try {
      await onJoin(tripId.trim());
      onClose();
      toast.success(`Trip ${tripId.trim()} joined successfully`);
    } catch (error) {
      toast.error(error.message || 'Failed to join trip');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50'>
      <div className='w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6'>
        {mode === 'menu' && (
          <div className='space-y-4'>
            <h2 className='text-3xl font-bold'>New Trip</h2>

            <button
              onClick={() => setMode('join')}
              className='w-full p-4 rounded-2xl bg-blue-500 text-white'
            >
              Join Trip
            </button>

            <button
              onClick={() => setMode('create')}
              className='w-full p-4 rounded-2xl bg-emerald-500 text-black'
            >
              Create Trip
            </button>

            <button
              onClick={onClose}
              className='w-full p-4 rounded-2xl border border-zinc-600'
            >
              Close
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className='space-y-4'>
            <h2 className='text-3xl font-bold'>Join Trip</h2>

            <input
              onChange={(event) => setTripId(event.target.value)}
              type='text'
              value={tripId}
              placeholder='Enter Trip Id'
              className='w-full p-4 rounded-2xl bg-zinc-800'
            />

            <div className='flex gap-3'>
              <button
                onClick={() => setMode('menu')}
                className='w-full p-4 rounded-2xl border border-zinc-600'
              >
                Back
              </button>

              <button
                onClick={handleJoinTrip}
                disabled={isJoining}
                className='w-full p-4 rounded-2xl bg-blue-500 text-white disabled:opacity-50'
              >
                {isJoining ? 'Joining...' : 'Join'}
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <>
            <div className='flex justify-between items-center'>
              <h2 className='text-3xl font-bold'>Create Group Trip</h2>

              <button
                onClick={() => setMode('menu')}
                className='text-zinc-400 text-sm uppercase tracking-wide'
              >
                Back
              </button>
            </div>

            {step === 1 && (
              <div className='mt-6 space-y-4'>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='Project Name'
                  className='w-full p-4 rounded-2xl bg-zinc-800 text-sm sm:text-base'
                />

                <input
                  type='number'
                  min='0'
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder='Budget'
                  className='w-full p-4 rounded-2xl bg-zinc-800 text-sm sm:text-base'
                />

                <input
                  type='number'
                  min='0'
                  value={spent}
                  onChange={(event) => setSpent(event.target.value)}
                  placeholder='Spent Amount'
                  className='w-full p-4 rounded-2xl bg-zinc-800 text-sm sm:text-base'
                />

                <input
                  type='date'
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className='w-full p-4 rounded-2xl bg-zinc-800 text-sm sm:text-base'
                />

                <input
                  type='date'
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className='w-full p-4 rounded-2xl bg-zinc-800 text-sm sm:text-base'
                />

                {!hasValidDateRange && startDate && endDate && (
                  <p className='text-sm text-orange-400'>Start date must be before or equal to end date.</p>
                )}

                <div className='rounded-2xl border border-zinc-700 bg-zinc-800 p-4'>
                  <p className='text-xs uppercase tracking-wide text-zinc-400'>Auto Status</p>
                  <p className='mt-2 text-lg font-semibold text-white'>{computedStatus}</p>
                </div>

                <button
                  disabled={!canReview}
                  onClick={() => setStep(2)}
                  className='w-full p-4 rounded-2xl bg-emerald-500 text-black disabled:opacity-40'
                >
                  Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className='mt-6 space-y-4'>
                <div className='p-4 rounded-2xl bg-zinc-800'>
                  Name: {name}
                  <br />
                  Dates: {tripDate}
                  <br />
                  Budget: ₹{parsedBudget}
                  <br />
                  Spent: ₹{parsedSpent}
                  <br />
                  Status: {computedStatus}
                </div>

                <div className='flex gap-3'>
                  <button
                    onClick={() => setStep(1)}
                    className='w-full p-4 rounded-2xl border border-zinc-600'
                  >
                    Back
                  </button>

                  <button
                    onClick={handleCreate}
                    className='w-full p-4 rounded-2xl bg-emerald-500 text-black'
                  >
                    Create Trip
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
