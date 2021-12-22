const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const SuiteSchema = new mongoose.Schema({
    building: {
        type: ObjectId,
        ref: "Building",
        required: true,
    },
    suite_no: {
        type: Number,
        required: true,
    },
    floor: {
        type: Number,
        required: true,
    },
    stove: {
        type: Boolean,
        default: false,
    },
    microwave: {
        type: Boolean,
        default: false,
    },
    dishwasher: {
        type: Boolean,
        default: false,
    },
    television: {
        type: Boolean,
        default: false,
    },
    laundry: {
        type: Boolean,
        default: false,
    },
    dining_area: {
        type: Boolean,
        default: false,
    },
    couches: {
        type: Boolean,
        default: false,
    }
});
const Suite = new mongoose.model("Suite", SuiteSchema);

module.exports = Suite;