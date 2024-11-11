const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    email: String,
    model: String,
    number: { type: String, unique: true },
    type: String,
    pdate: Date,
    image: String,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
