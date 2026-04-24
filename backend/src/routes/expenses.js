import express from 'express';
import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';

const router = express.Router();

function getTripPresentation(status, spent, budget) {
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  if (status === 'Done' && spent > budget) {
    return {
      type: 'completed',
      color: 'bg-zinc-200',
      bar: 'bg-orange-500',
      text: `Over budget by ₹${(spent - budget).toLocaleString('en-IN')}`,
    };
  }

  if (status === 'Done') {
    return {
      type: 'completed',
      color: 'bg-zinc-200',
      bar: 'bg-zinc-200',
      text: `${percent}% of budget used`,
    };
  }

  if (status === 'Active') {
    return {
      type: 'active',
      color: 'bg-emerald-500',
      bar: 'bg-emerald-500',
      text: `${percent}% of budget used`,
    };
  }

  return {
    type: 'planning',
    color: 'bg-blue-100',
    bar: 'bg-blue-500',
    text: `${percent}% committed`,
  };
}

async function updateTripSpent(tripId) {
  const trip = await Trip.findById(tripId);
  if (!trip) return;

  const expenses = await Expense.find({ tripId });
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const presentation = getTripPresentation(trip.status, totalSpent, trip.budget);
  trip.spent = totalSpent;
  Object.assign(trip, presentation);
  await trip.save();
}

router.get('/trip/:tripId', async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.params.tripId }).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/trip/:tripId', async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const expense = new Expense({
      tripId: req.params.tripId,
      description,
      amount: Number(amount),
    });

    await expense.save();
    await updateTripSpent(req.params.tripId);

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    const tripId = expense.tripId;
    await Expense.findByIdAndDelete(req.params.id);
    await updateTripSpent(tripId);

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;