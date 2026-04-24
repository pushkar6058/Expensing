import { useSelector, useDispatch } from 'react-redux';
import {
  openCreateModal,
  closeCreateModal,
  setFilter,
  fetchTrips,
  fetchExpenses,
  createTrip,
  addExpense,
  removeExpense,
} from './tripsSlice';

export function useTripsStore() {
  const dispatch = useDispatch();

  return {
    openCreateModal: () => dispatch(openCreateModal()),
    closeCreateModal: () => dispatch(closeCreateModal()),
    setFilter: (filter) => dispatch(setFilter(filter)),
    handleCreateTrip: (trip) => dispatch(createTrip(trip)),
    loadExpenses: (tripId) => dispatch(fetchExpenses(tripId)),
    addExpense: (tripId, expenseInput) =>
      dispatch(addExpense({ tripId, expenseInput })),
    removeExpense: (tripId, expenseId) =>
      dispatch(removeExpense({ tripId, expenseId })),
  };
}

export function useTripsSelector(selector) {
  return useSelector(selector);
}