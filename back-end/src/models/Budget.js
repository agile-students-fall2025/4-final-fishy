// back-end/src/models/Budget.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    category: { type: String, default: 'Other' },
    date: { type: String },
    note: { type: String, default: '' }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const budgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    currency: { type: String, default: 'USD', trim: true },
    limit: { type: Number, required: true, min: 0 },
    startDate: { type: String },
    endDate: { type: String },
    expenses: [expenseSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
