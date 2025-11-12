import { Router } from 'express';
import { listTrips, getTrip, createTrip, updateTrip, deleteTrip } from '../controllers/tripController.js';

const router = Router();

router.get('/', listTrips);
router.get('/:id', getTrip);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;
