import express from 'express';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import tripsRouter from './src/routes/trips.js';
import expensesRouter from './src/routes/expenses.js';
import userRouter from './src/routes/user.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/trips', tripsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/user',userRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port', process.env.PORT);
});