import express from 'express';
import { getExpensesByTripId, createExpense, deleteExpense } from '../controllers/expenses.js';

const router = express.Router();

router.get('/trip/:tripId', getExpensesByTripId);
router.post('/trip/:tripId', createExpense);
router.delete('/:id', deleteExpense);

export default router;