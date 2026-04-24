import Trip from '../models/Trip.js';
import User from '../models/User.js';
import { getAuthenticatedUser } from '../utils/getAuthenticatedUser.js';
import { isTripMember } from '../utils/isTripMember.js';
import { isValidTripDateRange } from '../utils/isValidTripDateRange.js';
import { syncTripComputedFields } from '../utils/syncTripComputedFields.js';

export async function getAllTrips(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const trips = await Trip.find({ members: user._id }).sort({ createdAt: -1 });
    await Promise.all(trips.map(async (trip) => {
      const previousStatus = trip.status;
      syncTripComputedFields(trip);
      if (trip.status !== previousStatus) await trip.save();
    }));
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getTripById(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const trip = await Trip.findById(req.params.id).populate('members', 'name email');
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (!isTripMember(trip, user._id)) {
      return res.status(403).json({ error: 'You do not have access to this trip' });
    }

    const previousStatus = trip.status;
    syncTripComputedFields(trip);
    if (trip.status !== previousStatus) await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createTrip(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { title, date, startDate, endDate, tag1, spent, budget } = req.body;
    if (!title || !date || !startDate || !endDate || budget == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!isValidTripDateRange(startDate, endDate)) {
      return res.status(400).json({ error: 'Start date must be before or equal to end date' });
    }

    const parsedSpent = Number(spent) || 0;
    const parsedBudget = Number(budget) || 0;

    const trip = new Trip({
      title,
      date,
      startDate,
      endDate,
      tag1: tag1 || null,
      members: [user._id],
      spent: parsedSpent,
      budget: parsedBudget,
    });

    syncTripComputedFields(trip);

    await trip.save();
    await User.findByIdAndUpdate(user._id, { $addToSet: { trips: trip._id } });

    const populatedTrip = await Trip.findById(trip._id).populate('members', 'name email');
    res.status(201).json(populatedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function joinTrip(req, res) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const isAlreadyMember = trip.members.some((memberId) => memberId.toString() === user._id.toString());

    if (!isAlreadyMember) {
      trip.members.push(user._id);
      await trip.save();
    }

    await User.findByIdAndUpdate(user._id, { $addToSet: { trips: trip._id } });

    const populatedTrip = await Trip.findById(trip._id).populate('members', 'name email');
    syncTripComputedFields(populatedTrip);
    res.json(populatedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateTrip(req, res) {
  try {
    const { title, date, startDate, endDate, tag1, spent, budget } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const nextStartDate = startDate != null ? startDate : trip.startDate;
    const nextEndDate = endDate != null ? endDate : trip.endDate;
    if (!isValidTripDateRange(nextStartDate, nextEndDate)) {
      return res.status(400).json({ error: 'Start date must be before or equal to end date' });
    }

    if (title != null) trip.title = title;
    if (date != null) trip.date = date;
    if (startDate != null) trip.startDate = startDate;
    if (endDate != null) trip.endDate = endDate;
    if (tag1 != null) trip.tag1 = tag1;
    if (spent != null) trip.spent = Number(spent) || 0;
    if (budget != null) trip.budget = Number(budget) || 0;

    syncTripComputedFields(trip);

    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteTrip(req, res) {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
