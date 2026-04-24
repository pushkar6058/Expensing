import Trip from '../models/Trip.js';
import Expense from '../models/Expense.js';
import { getAuthenticatedUser } from '../utils/getAuthenticatedUser.js';
import { isTripMember } from '../utils/isTripMember.js';
import { syncTripComputedFields } from '../utils/syncTripComputedFields.js';

async function updateTripSpent(tripId) {
  const trip = await Trip.findById(tripId);
  if (!trip) return;

  const expenses = await Expense.find({ tripId });
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  trip.spent = totalSpent;
  syncTripComputedFields(trip);
  await trip.save();
}

export async function getExpensesByTripId(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (!isTripMember(trip, user._id)) {
      return res.status(403).json({ error: 'You do not have access to this trip' });
    }

    const expenses = await Expense.find({ tripId: req.params.tripId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createExpense(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { description, amount } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    if (!isTripMember(trip, user._id)) {
      return res.status(403).json({ error: 'Join the trip before adding expenses' });
    }

    const expense = new Expense({
      tripId: req.params.tripId,
      description,
      createdBy: user._id,
      amount: Number(amount),
    });

    await expense.save();
    await updateTripSpent(req.params.tripId);

    const populatedExpense = await Expense.findById(expense._id).populate('createdBy', 'name email');

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteExpense(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    const trip = await Trip.findById(expense.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (!isTripMember(trip, user._id)) {
      return res.status(403).json({ error: 'You do not have access to this trip' });
    }
    if (expense.createdBy?.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Only the expense creator can delete this expense' });
    }

    const tripId = expense.tripId;
    await Expense.findByIdAndDelete(req.params.id);
    await updateTripSpent(tripId);

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
