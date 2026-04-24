import { useCallback, useEffect, useMemo, useState } from 'react';
import { tripsApi, expensesApi } from '../../../api/client';
import { getTripPresentation } from '../utils/getTripPresentation';
import TripsContext from './TripsContext';

function ensureTripShape(trip) {
  const spent = Number(trip.spent) || 0;
  const budget = Number(trip.budget) || 0;
  return {
    ...trip,
    spent,
    budget,
    ...getTripPresentation(trip.status, spent, budget),
  };
}

export default function TripsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tripList, setTripList] = useState([]);
  const [expensesByTripId, setExpensesByTripId] = useState(() => new Map());

  const loadExpenses = useCallback(async (tripId) => {
    if (expensesByTripId.has(tripId)) return;
    try {
      const expenses = await expensesApi.getByTripId(tripId);
      setExpensesByTripId((current) => {
        const next = new Map(current);
        next.set(tripId, expenses);
        return next;
      });
    } catch (err) {
      console.error('Failed to load expenses:', err);
    }
  }, [expensesByTripId]);

  // First load on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const trips = await tripsApi.getAll();
        if (!cancelled) {
          setTripList(trips.map(ensureTripShape));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);

  const handleCreateTrip = useCallback(async (trip) => {
    try {
      const created = await tripsApi.create(trip);
      setTripList((currentTrips) => [ensureTripShape(created), ...currentTrips]);
      setFilter('all');
      closeCreateModal();
    } catch (err) {
      setError(err.message);
    }
  }, [closeCreateModal]);

  const addExpense = useCallback(async (tripId, expenseInput) => {
    const amount = Number(expenseInput.amount) || 0;
    const description = (expenseInput.description || '').trim();
    if (!description || amount <= 0 || !tripId) return;

    try {
      const expense = await expensesApi.create(tripId, { description, amount });

      setExpensesByTripId((current) => {
        const next = new Map(current);
        const existing = next.get(tripId) || [];
        next.set(tripId, [expense, ...existing]);
        return next;
      });

      setTripList((currentTrips) =>
        currentTrips.map((trip) => {
          if (trip._id !== tripId && trip.id !== tripId) return trip;
          const nextSpent = (Number(trip.spent) || 0) + amount;
          return {
            ...trip,
            spent: nextSpent,
            ...getTripPresentation(trip.status, nextSpent, trip.budget),
          };
        }),
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const removeExpense = useCallback(async (tripId, expenseId) => {
    try {
      await expensesApi.delete(expenseId);

      let removedAmount = 0;
      setExpensesByTripId((current) => {
        const next = new Map(current);
        const existing = next.get(tripId) || [];
        const remaining = [];
        for (const expense of existing) {
          if (expense._id === expenseId || expense.id === expenseId) removedAmount = expense.amount;
          else remaining.push(expense);
        }
        next.set(tripId, remaining);
        return next;
      });

      if (removedAmount <= 0) return;

      setTripList((currentTrips) =>
        currentTrips.map((trip) => {
          if (trip._id !== tripId && trip.id !== tripId) return trip;
          const nextSpent = Math.max(0, (Number(trip.spent) || 0) - removedAmount);
          return {
            ...trip,
            spent: nextSpent,
            ...getTripPresentation(trip.status, nextSpent, trip.budget),
          };
        }),
      );
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const value = useMemo(
    () => ({
      addExpense,
      closeCreateModal,
      error,
      expensesByTripId,
      filter,
      handleCreateTrip,
      isCreateModalOpen,
      isLoading,
      loadExpenses,
      openCreateModal,
      removeExpense,
      setFilter,
      tripList,
    }),
    [
      addExpense,
      closeCreateModal,
      error,
      expensesByTripId,
      filter,
      handleCreateTrip,
      isCreateModalOpen,
      isLoading,
      loadExpenses,
      openCreateModal,
      removeExpense,
      tripList,
    ],
  );

  return <TripsContext.Provider value={value}>{children}</TripsContext.Provider>;
}