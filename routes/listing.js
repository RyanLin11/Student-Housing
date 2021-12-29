const express = require('express');
const router = express.Router();
const ListingModel = require('../models/listing');
const SuiteModel = require('../models/suite');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const {body} = require('express-validator');

async function add_listing(req, res) {
    req.body.leaser = req.session.user_id;
    const listing = new ListingModel(req.body);
    try {
        await listing.save();
        res.redirect('/listing');
    } catch(error) {
        res.status(500).send(error);
    }
}

async function add_listing_form(req, res, next) {
    const suite = await SuiteModel.findById(req.query.suite_id);
    res.render('create_listing', {suite: suite});
}

async function view_listings(req, res, next) {
    const listings = await ListingModel.find({}).populate('suite').populate('leaser').populate({path: 'suite', populate: {path: 'building'}});
    res.render('listings', {listings: listings});
}

async function view_listing(req, res, next) {
    const listing = await ListingModel.findById(req.params.listing_id).populate('suite').populate('leaser').populate({path: 'suite', populate: {path: 'building'}});
    res.render('listing', {listing: listing});
}

async function edit_listing_form(req, res, next) {
    const listing = await ListingModel.findById(req.params.listing_id);
    res.render('edit_listing', {listing: listing});
}
async function edit_listing(req, res, next) {
    // Unchecked Checkboxes are not sent
    let amenities = ['window', 'orientation', 'bathroom', 'air_conditioning', 'heating', 'wifi', 'pets_allowed', 'smoking'];
    amenities.forEach(amenity => {
        if(!(amenity in req.body)) {
            req.body[amenity] = false;
        }
    });
    await ListingModel.findByIdAndUpdate(req.params.listing_id, req.body);
    res.redirect(`/listing/${req.params.listing_id}`);
}

async function delete_listing(req, res) {
    await ListingModel.findByIdAndDelete(req.params.listing_id);
    res.redirect('/listing');
}

router.get("/", view_listings);
router.post("/add",
    body('suite').customSanitizer(value => {
        return ObjectId(value);
    }),
    add_listing);
router.get("/add", add_listing_form);
router.get('/:listing_id', view_listing);
router.get('/:listing_id/edit', edit_listing_form);
router.post('/:listing_id/edit', edit_listing);
router.delete('/:listing_id', delete_listing);

module.exports = router;