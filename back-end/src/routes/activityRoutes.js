import { Router } from 'express';
import { getRecommendedActivities } from '../controllers/activityController.js';

const router = Router();

router.get('/recommendations', getRecommendedActivities);

export default router;

