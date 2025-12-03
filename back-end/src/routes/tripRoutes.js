import { Router } from 'express';
import { listTrips, getTrip, createTrip, updateTrip, deleteTrip, getPublicTrip } from '../controllers/tripController.js';
import { authMiddleware } from '../utils/auth.js';

const router = Router();

// Public route for shared trips (no auth required)
router.get('/public/:id', getPublicTrip);

// All other trip routes require authentication
router.use(authMiddleware);

router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
