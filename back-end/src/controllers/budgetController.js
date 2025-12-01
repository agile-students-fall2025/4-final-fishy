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

export const getOne = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load budget' });
  }
};

export const create = async (req, res) => {
  try {
    const { error, value } = budgetCreateSchema.validate(req.body || {}, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const budget = await Budget.create(value);
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const patch = async (req, res) => {
  try {
    const { error, value } = budgetUpdateSchema.validate(req.body || {}, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const budget = await Budget.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

export const destroy = async (req, res) => {
  try {
    const deleted = await Budget.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Budget not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};

export const addExp = async (req, res) => {
  try {
    const { error, value } = expenseCreateSchema.validate(req.body || {}, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    const expensePayload = {
      amount: value.amount,
      currency: value.currency || budget.currency || 'USD',
      category: value.category || 'Other',
      date: value.date || new Date().toISOString().slice(0, 10),
      note: value.note || ''
    };
    budget.expenses.push(expensePayload);
    await budget.save();
    const created = budget.expenses[budget.expenses.length - 1];
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

export const patchExp = async (req, res) => {
  try {
    const { error, value } = expenseUpdateSchema.validate(req.body || {}, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget or expense not found' });
    const expense = budget.expenses.id(req.params.expenseId);
    if (!expense) return res.status(404).json({ error: 'Budget or expense not found' });
    if (value.amount !== undefined) expense.amount = value.amount;
    if (value.currency !== undefined) expense.currency = value.currency;
    if (value.category !== undefined) expense.category = value.category;
    if (value.date !== undefined) expense.date = value.date;
    if (value.note !== undefined) expense.note = value.note;
    await budget.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const destroyExp = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget or expense not found' });
    const expense = budget.expenses.id(req.params.expenseId);
    if (!expense) return res.status(404).json({ error: 'Budget or expense not found' });
    expense.deleteOne();
    await budget.save();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
