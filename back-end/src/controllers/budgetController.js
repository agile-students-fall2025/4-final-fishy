import {
  listBudgets, getBudget, createBudget, updateBudget, removeBudget,
  addExpense, updateExpense, removeExpense
} from '../data/budgetStore.js';

export const getAll = (_req, res) => res.json(listBudgets());

export const getOne = (req, res) => {
  const b = getBudget(req.params.id);
  if (!b) return res.status(404).json({ error: 'Budget not found' });
  res.json(b);
};

export const create = (req, res) => {
  const { name, limit } = req.body || {};
  if (!name || limit === undefined) return res.status(400).json({ error: 'name and limit are required' });
  const b = createBudget(req.body);
  res.status(201).json(b);
};

export const patch = (req, res) => {
  const b = updateBudget(req.params.id, req.body || {});
  if (!b) return res.status(404).json({ error: 'Budget not found' });
  res.json(b);
};

export const destroy = (req, res) => {
  const ok = removeBudget(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Budget not found' });
  res.status(204).end();
};

// Expenses
export const addExp = (req, res) => {
  const e = addExpense(req.params.id, req.body || {});
  if (!e) return res.status(404).json({ error: 'Budget not found' });
  res.status(201).json(e);
};

export const patchExp = (req, res) => {
  const e = updateExpense(req.params.id, req.params.expenseId, req.body || {});
  if (!e) return res.status(404).json({ error: 'Budget or expense not found' });
  res.json(e);
};

export const destroyExp = (req, res) => {
  const ok = removeExpense(req.params.id, req.params.expenseId);
  if (!ok) return res.status(404).json({ error: 'Budget or expense not found' });
  res.status(204).end();
};
