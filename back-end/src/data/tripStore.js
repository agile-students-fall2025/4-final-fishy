// back-end/src/data/tripStore.js
import mongoose from 'mongoose';
import Trip from '../models/Trip.js';

export async function getAll() {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    // Transform MongoDB documents to match expected format
    return trips.map(trip => ({
      id: trip._id.toString(),
      destination: trip.destination || 'Untitled trip',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      days: trip.days || [],
      createdAt: trip.createdAt
    }));
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
}

export async function getById(id) {
  try {
    const trip = await Trip.findById(id);
    if (!trip) return null;
    return {
      id: trip._id.toString(),
      destination: trip.destination || 'Untitled trip',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      days: trip.days || [],
      createdAt: trip.createdAt
    };
  } catch (error) {
    console.error('Error fetching trip by id:', error);
    return null;
  }
}

export async function create(trip) {
  try {
    // Ensure MongoDB connection is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Ready state: ' + mongoose.connection.readyState);
    }
    
    const doc = await Trip.create({
      destination: trip.destination?.trim() || 'Untitled trip',
      startDate: trip.startDate || '',
      endDate: trip.endDate || '',
      days: Array.isArray(trip.days) ? trip.days : []
    });
    return {
      id: doc._id.toString(),
      destination: doc.destination || 'Untitled trip',
      startDate: doc.startDate || '',
      endDate: doc.endDate || '',
      days: doc.days || [],
      createdAt: doc.createdAt
    };
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
}

export async function update(id, patch) {
  try {
    const doc = await Trip.findByIdAndUpdate(
      id,
      {
        ...(patch.destination !== undefined && { destination: patch.destination }),
        ...(patch.startDate !== undefined && { startDate: patch.startDate }),
        ...(patch.endDate !== undefined && { endDate: patch.endDate }),
        ...(patch.days !== undefined && { days: patch.days })
      },
      { new: true, runValidators: true }
    );
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      destination: doc.destination || 'Untitled trip',
      startDate: doc.startDate || '',
      endDate: doc.endDate || '',
      days: doc.days || [],
      createdAt: doc.createdAt
    };
  } catch (error) {
    console.error('Error updating trip:', error);
    return null;
  }
}

export async function remove(id) {
  try {
    const deleted = await Trip.findByIdAndDelete(id);
    return !!deleted;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return false;
  }
}
