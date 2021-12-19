const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema({
    place_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    formatted_address: {
        type: String,
        required: true,
    },
});

const Building = mongoose.model("Building", BuildingSchema);

module.exports = Building;