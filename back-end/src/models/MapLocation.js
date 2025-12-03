// back-end/src/models/MapLocation.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const mapLocationSchema = new Schema(
  {
    title: { type: String, default: 'Untitled', trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    note: { type: String, default: '' },
    photos: { type: [String], default: [] }, // base64 images
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const MapLocation = mongoose.model('MapLocation', mapLocationSchema);
export default MapLocation;
