import express from 'express';
import { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, joinTrip } from '../controllers/trips.js';

const router = express.Router();

router.get('/', getAllTrips);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.post('/:id/join', joinTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
