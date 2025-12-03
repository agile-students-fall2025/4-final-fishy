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
    userId: { type: String, required: true, index: true },
    tripId: { type: String, required: true, index: true }, // Link to trip
    name: { type: String, required: true, trim: true },
    currency: { type: String, default: 'USD', trim: true },
    limit: { type: Number, required: true, min: 0 },
    startDate: { type: String },
    endDate: { type: String },
    expenses: [expenseSchema]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id.toString();
        // Ensure tripId is always included in the response
        // Access tripId from the document directly
        if (doc.tripId) {
          ret.tripId = String(doc.tripId);
        } else if (ret.tripId) {
          ret.tripId = String(ret.tripId);
        } else {
          // If tripId is missing, log a warning but don't fail
          console.warn('Budget document missing tripId:', doc._id);
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
