const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ListingSchema = new mongoose.Schema({
    location: {
        type: ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    room: {
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
    email: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: 'https://newhomelistingservice.com/assets/default_logo/large_square_emg_default-04cb60da994cb5a009f5f7640a7881a7b035e7bddba555c218b5e084b2a64f93.jpg',
    },
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;