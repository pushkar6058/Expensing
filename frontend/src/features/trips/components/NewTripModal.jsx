import { useState } from 'react';
import { getTripPresentation } from '../utils/getTripPresentation';
import toast from 'react-hot-toast';

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

export default function NewTripModal({ onClose, onCreate }) {
  const [mode, setMode] = useState('menu');
  const [step, setStep] = useState(1);

  const [tripId, setTripId]=useState("");

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('');
  const [spent, setSpent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('Planning');

  const tripDate = formatTripDate(startDate, endDate);

  const parsedBudget = Number(budget) || 0;
  const parsedSpent = Number(spent) || 0;
  const parsedPeople = Number(people) || 0;

  const canReview = Boolean(
    name.trim() &&
      budget &&
      people &&
      startDate &&
      endDate
  );

  const handleCreate = () => {
    const tripPresentation = getTripPresentation(
      status,
      parsedSpent,
      parsedBudget
    );

    onCreate({
      id: Date.now(),
      title: name.trim(),
      date: tripDate,
      people: `${parsedPeople} people`,
      spent: parsedSpent,
      budget: parsedBudget,
      status,
      ...tripPresentation,
    });

    onClose();
  };


  const handleJoinTrip = (tripId) => {
  //  some computation for the backend
   onClose();
   toast.success(`Trip ${tripId} joined successfully`);
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

        {/* MENU */}
        {mode === 'menu' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">New Trip</h2>

            <button
              onClick={() => setMode('join')}
              className="w-full p-4 rounded-2xl bg-blue-500 text-white"
            >
              Join Trip
            </button>

            <button
              onClick={() => setMode('create')}
              className="w-full p-4 rounded-2xl bg-emerald-500 text-black"
            >
              Create Trip
            </button>

            <button
              onClick={onClose}
              className="w-full p-4 rounded-2xl border border-zinc-600"
            >
              Close
            </button>
          </div>
        )}

        {/* JOIN TRIP */}
        {mode === 'join' && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Join Trip</h2>

            <input
              onChange={(e)=>setTripId(e.target.value)}
              type="number"
              placeholder="Enter Trip Unique Code"
              className="w-full p-4 rounded-2xl bg-zinc-800"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setMode('menu')}
                className="w-full p-4 rounded-2xl border border-zinc-600"
              >
                Back
              </button>

              <button 
              onClick={()=>handleJoinTrip(tripId)}
              className="w-full p-4 rounded-2xl bg-blue-500 text-white">
                Join
              </button>
            </div>
          </div>
        )}

        {/* CREATE TRIP */}
        {mode === 'create' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Create Group Trip</h2>

              <button
                onClick={() => setMode('menu')}
                className="text-zinc-400 text-sm uppercase tracking-wide"
              >
                Back
              </button>
            </div>

            {step === 1 && (
              <div className="mt-6 space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project Name"
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                />

                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget"
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                />

                <input
                  type="number"
                  min="1"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="People Count"
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                />

                <input
                  type="number"
                  min="0"
                  value={spent}
                  onChange={(e) => setSpent(e.target.value)}
                  placeholder="Spent Amount"
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                />

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                />

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-zinc-800"
                >
                  <option>Planning</option>
                  <option>Active</option>
                  <option>Done</option>
                </select>

                <button
                  disabled={!canReview}
                  onClick={() => setStep(2)}
                  className="w-full p-4 rounded-2xl bg-emerald-500 text-black disabled:opacity-40"
                >
                  Review
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-800">
                  Name: {name}
                  <br />
                  Dates: {tripDate}
                  <br />
                  Budget: ₹{parsedBudget}
                  <br />
                  Spent: ₹{parsedSpent}
                  <br />
                  People: {parsedPeople}
                  <br />
                  Status: {status}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full p-4 rounded-2xl border border-zinc-600"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleCreate}
                    className="w-full p-4 rounded-2xl bg-emerald-500 text-black"
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