const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const PhotoModel = require('./photo');
const ListingModel = require('./listing');

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
    },
    photos: {
        type: [ObjectId],
        ref: "Photo",
    },
    listings: {
        type: [ObjectId],
        ref: "Listing",
    }
});

SuiteSchema.pre('deleteOne', {document:true, query:false}, function(next) {
    //Delete Photos
    if(this.photos) {
        this.photos.forEach(photo_id => {
            const photo = PhotoModel.findById(photo_id);
            photo.deleteOne();
        })
    }
    //Delete Listings
    if(this.listings) {
        this.listings.forEach(listing_id => {
            const listing = ListingModel.findById(listing_id);
            listing.deleteOne();
        })
    }
    next();
});

const Suite = new mongoose.model("Suite", SuiteSchema);

module.exports = Suite;