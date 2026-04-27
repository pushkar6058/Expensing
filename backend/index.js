import express from 'express';
import { connectDB } from './src/config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tripsRouter from './src/routes/trips.js';
import expensesRouter from './src/routes/expenses.js';
import userRouter from './src/routes/user.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://expensing-wi2t.vercel.app"
    ].filter(Boolean);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/auth', userRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/expenses', expensesRouter);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port', process.env.PORT);
});
