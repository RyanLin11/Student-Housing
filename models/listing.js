const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ListingSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    moveInDate: {
        type: String,
        required: true,
    },
    moveOutDate: {
        type: String,
        required: true,
    },
    leaser: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    suite: {
        type: ObjectId,
        ref: "Suite",
        required: true,
    },
    room_no: {
        type: Number,
        required: true,
    },
    room_size: {
        type: Number,
        default: 0,
    },
    window: {
        type: Boolean,
        default: false,
    },
    orientation: {
        type: String,
        default: 'N/A',
    },
    bathroom: {
        type: Boolean,
        default: false,
    },
    air_conditioning: {
        type: Boolean,
        default: false,
    },
    heating: {
        type: Boolean,
        default: false,
    },
    wifi: {
        type: Boolean,
        default: true,
    },
    pets_allowed: {
        type: Boolean,
        default: false,
    },
    smoking: {
        type: Boolean,
        default: false,
    },
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;