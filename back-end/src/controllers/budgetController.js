import Joi from 'joi';
import Budget from '../models/Budget.js';
import Trip from '../models/Trip.js';

function getUserId(req) {
  return req.user?.id || req.user?._id || null;
}

const budgetCreateSchema = Joi.object({
  tripId: Joi.string().trim().required(),
  name: Joi.string().trim().min(1).required(),
  currency: Joi.string().trim().default('USD'),
  limit: Joi.number().min(0).required(),
  startDate: Joi.string().allow(null, ''),
  endDate: Joi.string().allow(null, '')
});

const budgetUpdateSchema = Joi.object({
  tripId: Joi.string().trim(),
  name: Joi.string().trim().min(1),
  currency: Joi.string().trim(),
  limit: Joi.number().min(0),
  startDate: Joi.string().allow(null, ''),
  endDate: Joi.string().allow(null, '')
}).min(1);


const expenseCreateSchema = Joi.object({
  amount: Joi.number().min(0).required()
});

const expenseUpdateSchema = Joi.object({
  amount: Joi.number().min(0),
  currency: Joi.string().trim(),
  category: Joi.string().trim(),
  date: Joi.string().allow(null, ''),
  note: Joi.string().allow('')
}).min(1);

export const getAll = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { tripId } = req.query;
    const query = { userId };
    if (tripId) {
      query.tripId = tripId;
    }
    const budgets = await Budget.find(query).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ error: 'Failed to load budgets' });
  }
};

export const getOne = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const budget = await Budget.findOne({ _id: req.params.id, userId });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    console.error('getOne error:', err);
    res.status(500).json({ error: 'Failed to load budget' });
  }
};

export const create = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { error, value } = budgetCreateSchema.validate(req.body || {}, {
      stripUnknown: true
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const trip = await Trip.findOne({ _id: value.tripId, userId });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found or does not belong to you' });
    }

    const existingBudget = await Budget.findOne({ tripId: value.tripId, userId });
    if (existingBudget) {
      return res.status(409).json({ error: 'A budget already exists for this trip' });
    }

    const budget = await Budget.create({ ...value, userId });
    console.log('Budget created - Document tripId:', budget.tripId, 'Expected tripId:', value.tripId);
    const budgetJson = budget.toJSON();
    console.log('Budget JSON - tripId:', budgetJson.tripId);
    res.status(201).json(budgetJson);
  } catch (err) {
    console.error('create budget error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid trip ID format' });
    }
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

export const patch = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { error, value } = budgetUpdateSchema.validate(req.body || {}, {
      stripUnknown: true
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (value.tripId) {
      const trip = await Trip.findOne({ _id: value.tripId, userId });
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found or does not belong to you' });
      }
      
      const existingBudget = await Budget.findOne({ 
        tripId: value.tripId, 
        userId,
        _id: { $ne: req.params.id } // Exclude current budget
      });
      if (existingBudget) {
        return res.status(409).json({ error: 'A budget already exists for this trip' });
      }
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId },
      value,
      {
        new: true,
        runValidators: true
      }
    );
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    console.error('patch budget error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid trip ID format' });
    }
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

export const destroy = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(404).json({ error: 'Budget not found' });
    res.status(204).end();
  } catch (err) {
    console.error('destroy budget error:', err);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};

export const addExp = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { error } = expenseCreateSchema.validate({
      amount: req.body?.amount
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const budget = await Budget.findOne({ _id: req.params.id, userId });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });

    const value = req.body || {};

    const expensePayload = {
      amount: Number(value.amount),
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
    console.error('addExp error:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

export const patchExp = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { error } = expenseUpdateSchema.validate(req.body || {}, {
      stripUnknown: true
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const budget = await Budget.findOne({ _id: req.params.id, userId });
    if (!budget) return res.status(404).json({ error: 'Budget or expense not found' });

    const expense = budget.expenses.id(req.params.expenseId);
    if (!expense) return res.status(404).json({ error: 'Budget or expense not found' });

    const value = req.body || {};

    if (value.amount !== undefined) expense.amount = Number(value.amount);
    if (value.currency !== undefined) expense.currency = value.currency;
    if (value.category !== undefined) expense.category = value.category;
    if (value.date !== undefined) expense.date = value.date;
    if (value.note !== undefined) expense.note = value.note;

    await budget.save();
    res.json(expense);
  } catch (err) {
    console.error('patchExp error:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const destroyExp = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const budget = await Budget.findOne({ _id: req.params.id, userId });
    if (!budget) return res.status(404).json({ error: 'Budget or expense not found' });

    const expense = budget.expenses.id(req.params.expenseId);
    if (!expense) return res.status(404).json({ error: 'Budget or expense not found' });

    expense.deleteOne();
    await budget.save();
    res.status(204).end();
  } catch (err) {
    console.error('destroyExp error:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
