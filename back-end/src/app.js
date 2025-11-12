// back-end/src/app.js
import express from 'express';
import cors from 'cors';
import tripsRouter from './routes/tripRoutes.js';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());

app.get('/', (_req, res) => res.status(200).json({ ok: true })); // simple health
app.use('/api/trips', tripsRouter);

export default app;
