// back-end/src/app.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import tripsRouter from './routes/tripRoutes.js';
import userRouter from './routes/userRoutes.js';
import budgetsRouter from './routes/budgetRoutes.js';
import mapRouter from './routes/mapRoutes.js';
import weatherRouter from './routes/weatherRoutes.js';
import activityRouter from './routes/activityRoutes.js';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (_req, res) => res.status(200).json({ ok: true })); // simple health

// Database health check endpoint
app.get('/api/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(dbState === 1 ? 200 : 503).json({
    ok: dbState === 1,
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});
app.use('/api/trips', tripsRouter);
app.use('/api/users', userRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/map', mapRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/activities', activityRouter); 

export default app;