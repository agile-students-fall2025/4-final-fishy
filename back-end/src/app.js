// back-end/src/app.js
import express from 'express';
import cors from 'cors';
import tripsRouter from './routes/tripRoutes.js';
import userRouter from './routes/userRoutes.js';
import budgetsRouter from './routes/budgetRoutes.js';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

app.get('/', (_req, res) => res.status(200).json({ ok: true })); // simple health
app.use('/api/trips', tripsRouter);
app.use('/api/users', userRouter);
app.use('/api/budgets', budgetsRouter);

export default app;