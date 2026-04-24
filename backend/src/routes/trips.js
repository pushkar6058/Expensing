import express from 'express';
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

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, date, tag1, people, spent, budget, status } = req.body;
    if (!title || !date || !people || budget == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parsedSpent = Number(spent) || 0;
    const parsedBudget = Number(budget) || 0;
    const parsedStatus = status || 'Planning';

    const trip = new Trip({
      title,
      date,
      tag1: tag1 || null,
      people,
      spent: parsedSpent,
      budget: parsedBudget,
      status: parsedStatus,
      ...getTripPresentation(parsedStatus, parsedSpent, parsedBudget),
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, date, tag1, people, spent, budget, status } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    if (title != null) trip.title = title;
    if (date != null) trip.date = date;
    if (tag1 != null) trip.tag1 = tag1;
    if (people != null) trip.people = people;
    if (spent != null) trip.spent = Number(spent) || 0;
    if (budget != null) trip.budget = Number(budget) || 0;
    if (status != null) trip.status = status;

    const presentation = getTripPresentation(trip.status, trip.spent, trip.budget);
    Object.assign(trip, presentation);

    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;