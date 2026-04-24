import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tripsApi, expensesApi } from '../../../api/client';
import { getTripPresentation } from '../utils/getTripPresentation';
import { getTripStatus } from '../utils/getTripStatus';

function ensureTripShape(trip) {
  const spent = Number(trip.spent) || 0;
  const budget = Number(trip.budget) || 0;
  const status = getTripStatus(trip.startDate, trip.endDate, trip.status);

  return {
    ...trip,
    spent,
    budget,
    status,
    ...getTripPresentation(status, spent, budget),
  };
}

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
  const trips = await tripsApi.getAll();
  return trips.map(ensureTripShape);
});

export const fetchTripById = createAsyncThunk('trips/fetchTripById', async (tripId) => {
  const trip = await tripsApi.getById(tripId);
  return ensureTripShape(trip);
});

export const fetchExpenses = createAsyncThunk('trips/fetchExpenses', async (tripId) => {
  const expenses = await expensesApi.getByTripId(tripId);
  return { tripId, expenses };
});

export const createTrip = createAsyncThunk('trips/createTrip', async (tripData) => {
  const trip = await tripsApi.create(tripData);
  return ensureTripShape(trip);
});

export const joinTrip = createAsyncThunk('trips/joinTrip', async (tripId) => {
  const trip = await tripsApi.join(tripId);
  return ensureTripShape(trip);
});

export const addExpense = createAsyncThunk(
  'trips/addExpense',
  async ({ tripId, expenseInput }) => {
    const amount = Number(expenseInput.amount) || 0;
    const description = (expenseInput.description || '').trim();
    if (!description || amount <= 0 || !tripId) return;
    const expense = await expensesApi.create(tripId, { description, amount });
    return { tripId, expense, amount };
  },
);

export const removeExpense = createAsyncThunk(
  'trips/removeExpense',
  async ({ tripId, expenseId }) => {
    await expensesApi.delete(expenseId);
    return { tripId, expenseId };
  },
);

const initialState = {
  tripList: [],
  expensesByTripId: {},
  filter: 'all',
  isCreateModalOpen: false,
  isLoading: true,
  error: null,
};

function upsertTrip(state, nextTrip, { prepend = false } = {}) {
  const tripIndex = state.tripList.findIndex(
    (trip) => trip._id === nextTrip._id || trip.id === nextTrip.id,
  );

  if (tripIndex === -1) {
    if (prepend) state.tripList.unshift(nextTrip);
    else state.tripList.push(nextTrip);
    return;
  }

  state.tripList[tripIndex] = nextTrip;
}

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.tripList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(fetchTripById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        upsertTrip(state, action.payload);
        state.isLoading = false;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expensesByTripId[action.payload.tripId] = action.payload.expenses;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        upsertTrip(state, action.payload, { prepend: true });
        state.isCreateModalOpen = false;
      })
      .addCase(joinTrip.fulfilled, (state, action) => {
        upsertTrip(state, action.payload, { prepend: true });
        state.isCreateModalOpen = false;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        const { tripId, expense, amount } = action.payload;
        if (!expense) return;
        state.expensesByTripId[tripId] = [expense, ...(state.expensesByTripId[tripId] || [])];
        const tripIndex = state.tripList.findIndex(
          (t) => t._id === tripId || t.id === tripId,
        );
        if (tripIndex !== -1) {
          const trip = state.tripList[tripIndex];
          const nextSpent = (trip.spent || 0) + amount;
          state.tripList[tripIndex] = {
            ...trip,
            spent: nextSpent,
            ...getTripPresentation(trip.status, nextSpent, trip.budget),
          };
        }
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        const { tripId, expenseId } = action.payload;
        const expenses = state.expensesByTripId[tripId] || [];
        const removedExpense = expenses.find(
          (e) => e._id === expenseId || e.id === expenseId,
        );
        const removedAmount = removedExpense ? removedExpense.amount : 0;
        state.expensesByTripId[tripId] = expenses.filter(
          (e) => e._id !== expenseId && e.id !== expenseId,
        );
        if (removedAmount > 0) {
          const tripIndex = state.tripList.findIndex(
            (t) => t._id === tripId || t.id === tripId,
          );
          if (tripIndex !== -1) {
            const trip = state.tripList[tripIndex];
            const nextSpent = Math.max(0, trip.spent - removedAmount);
            state.tripList[tripIndex] = {
              ...trip,
              spent: nextSpent,
              ...getTripPresentation(trip.status, nextSpent, trip.budget),
            };
          }
        }
      });
  },
});

export const { openCreateModal, closeCreateModal, setFilter } = tripsSlice.actions;
export default tripsSlice.reducer;
