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
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://expensing-wi2t.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

// Health check endpoint to prevent Render cold starts
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', userRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/expenses', expensesRouter);

app.listen(PORT, () => console.log(`Running on ${PORT}`));