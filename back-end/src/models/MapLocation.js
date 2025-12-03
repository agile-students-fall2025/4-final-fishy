// back-end/src/models/MapLocation.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  {
    _id: true, // we use _id and later expose it as `id` in toJSON
  }
);

const mapLocationSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled', trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    note: { type: String, default: '' },
    photos: { type: [String], default: [] }, // base64 strings
    tasks: { type: [taskSchema], default: [] },
    // (Optional later) userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Top-level id
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        // Normalize task ids as `id`
        if (Array.isArray(ret.tasks)) {
          ret.tasks = ret.tasks.map((t) => {
            const task = { ...t };
            if (task._id) {
              task.id = task._id.toString();
              delete task._id;
            }
            return task;
          });
        }

        return ret;
      },
    },
  }
);

const MapLocation = mongoose.model('MapLocation', mapLocationSchema);

export default MapLocation;
