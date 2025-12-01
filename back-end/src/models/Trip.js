// back-end/src/models/Trip.js
import mongoose from 'mongoose';

const daySchema = new mongoose.Schema(
  {
    date: { type: String, default: '' },
    activities: [{ type: String }]
  },
  {
    _id: true
  }
);

const tripSchema = new mongoose.Schema(
  {
    destination: { type: String, default: 'Untitled trip', trim: true },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    days: [daySchema]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;

