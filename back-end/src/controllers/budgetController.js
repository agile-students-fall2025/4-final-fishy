import Joi from 'joi';
import Budget from '../models/Budget.js';

const budgetCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  currency: Joi.string().trim().default('USD'),
  limit: Joi.number().min(0).required(),
  startDate: Joi.string().allow(null, ''),
  endDate: Joi.string().allow(null, '')
});

const budgetUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1),
  currency: Joi.string().trim(),
  limit: Joi.number().min(0),
  startDate: Joi.string().allow(null, ''),
  endDate: Joi.string().allow(null, '')
}).min(1);

const expenseCreateSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  date: Joi.string().optional(),
  note: Joi.string().allow('', null).optional()
});

const expenseUpdateSchema = Joi.object({
  amount: Joi.number().min(0),
  currency: Joi.string().trim(),
  category: Joi.string().trim(),
  date: Joi.string(),
  note: Joi.string().allow('', null)
}).min(1);

export const getAll = async (_req, res) => {
  try {
    const budgets = await Budget.find().sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load budgets' });
  }
};

