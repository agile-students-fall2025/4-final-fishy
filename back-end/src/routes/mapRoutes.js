// back-end/src/routes/mapRoutes.js
import express from 'express';
import { authMiddleware } from '../utils/auth.js';

import {
  listAll,
  getOne,
  createOne,
  updateOne,
  removeOne,
  addPhotosOne,
} from '../controllers/mapController.js';

const router = express.Router();

// All map routes are user-specific and require a valid JWT
router.use(authMiddleware);

router.get('/locations', listAll);
router.get('/locations/:id', getOne);
router.post('/locations', createOne);
router.put('/locations/:id', updateOne);
router.delete('/locations/:id', removeOne);
router.post('/locations/:id/photos', addPhotosOne);

export default router;
