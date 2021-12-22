const express = require('express');
const router = express.Router();
const ListingModel = require('../models/listing');
const SuiteModel = require('../models/suite');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

async function add_listing(req, res) {
    req.body.moveInDate = new Date(req.body.moveInDate).toDateString();
    req.body.moveOutDate = new Date(req.body.moveOutDate).toDateString();
    req.body.suite = ObjectId(req.body.suite);
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

async function edit_listing(req, res, next) {
    await ListingModel.findByIdAndUpdate(req.params.listing_id);
    res.redirect(`/listing/${req.params.listing_id}`);
}

async function delete_listing(req, res) {
    await ListingModel.findByIdAndDelete(req.params.listing_id);
    res.redirect('/listing');
}

router.get("/", view_listings);
router.post("/add", add_listing);
router.get("/add", add_listing_form);
router.get('/:listing_id', view_listing);
router.put('/:listing_id', edit_listing);
router.delete('/:listing_id', delete_listing);

module.exports = router;