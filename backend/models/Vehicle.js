const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    type: String,
    date: Date,
    cost: Number,
});

const vehicleSchema = new mongoose.Schema({
    email: String,
    model: String,
    number: { type: String, unique: true },
    type: String,
    pdate: Date,
    image: String,
    maintenanceRecords: [maintenanceSchema] // Array of maintenance records
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
