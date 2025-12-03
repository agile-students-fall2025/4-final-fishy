import { Router } from 'express';
import {
  getAll, getOne, create, patch, destroy,
  addExp, patchExp, destroyExp
} from '../controllers/budgetController.js';
import { authMiddleware } from '../utils/auth.js';

const router = Router();

// All budget routes require authentication
router.use(authMiddleware);

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.patch('/:id', patch);
router.delete('/:id', destroy);

// expenses
router.post('/:id/expenses', addExp);
router.patch('/:id/expenses/:expenseId', patchExp);
router.delete('/:id/expenses/:expenseId', destroyExp);

export default router;
