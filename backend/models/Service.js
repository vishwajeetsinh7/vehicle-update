const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    mtype: String,
    mdate: Date,
    mcost: Number,
    number: String, // Vehicle registration number
});

module.exports = mongoose.model('Service', serviceSchema);
