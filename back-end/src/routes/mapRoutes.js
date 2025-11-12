// back-end/src/routes/mapRoutes.js
import { Router } from 'express';
import {
  listAll, getOne, createOne, updateOne, removeOne,
  createTask, updateTaskOne, removeTaskOne, addPhotosOne
} from '../controllers/mapController.js';

const router = Router();

// locations
router.get('/locations', listAll);
router.get('/locations/:id', getOne);
router.post('/locations', createOne);
router.put('/locations/:id', updateOne);
router.delete('/locations/:id', removeOne);

// tasks
router.post('/locations/:id/tasks', createTask);
router.put('/locations/:id/tasks/:taskId', updateTaskOne);
router.delete('/locations/:id/tasks/:taskId', removeTaskOne);

// photos
router.post('/locations/:id/photos', addPhotosOne);

export default router;
