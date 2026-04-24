import { getTripPresentation } from '../controllers/getTripPresentation.js';
import { getTripStatus } from './getTripStatus.js';

export function syncTripComputedFields(trip) {
  const nextStatus = getTripStatus(trip.startDate, trip.endDate, trip.status);
  const presentation = getTripPresentation(nextStatus, trip.spent, trip.budget);

  trip.status = nextStatus;
  Object.assign(trip, presentation);

  return trip;
}
