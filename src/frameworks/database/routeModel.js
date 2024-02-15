const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: { type: [Number], required: true }
}, { _id: false });

const RouteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    vehicleId: { type: String, required: true },
    startPoint: { type: LocationSchema, required: true },
    endPoint: { type: LocationSchema, required: true },
    startDate: { type: Date, required: true },
    estimatedEndDate: { type: Date, required: true },
    distance: { type: Number },
    duration: { type: String },
    status: {
        type: String,
        enum: ['pending', 'inProgress', 'completed', 'cancelled'],
        default: 'pending'
    },
    avoidTolls: { type: Boolean, required: true },
    avoidHighways: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Route', RouteSchema);