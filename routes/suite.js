const express = require('express');
const router = express.Router();
const BuildingModel = require('../models/building');
const SuiteModel = require('../models/suite');
const PhotoModel = require('../models/photo');
const url = require('url');

async function choose_suite_form(req, res, next) {
    const building = await BuildingModel.findById(req.query.building_id);
    let suites = await SuiteModel.find({building: building._id});
    res.render('choose_suite', {building: building, suites: suites});
}

async function choose_suite(req, res, next) {
    res.redirect(url.format({
        pathname: '/listing/add',
        query: {
            'suite_id': req.body.suite_id,
        }
    }));
}

async function create_suite_form(req, res, next) {
    const building = await BuildingModel.findById(req.query.building_id);
    res.render('create_suite', {building: building});
}

async function create_suite(req, res) {
    const suite = new SuiteModel(req.body);
    await suite.save();
    res.redirect(url.format({
        pathname: '/listing/add',
        query: {
            'suite_id': suite._id.toString(),
        }
    }));
}

async function view_suite(req, res, next) {
    const suite = await SuiteModel.findById(req.params.suite_id).populate('building').populate('photos');
    res.render("suite", {suite: suite});
}

async function edit_suite_form(req, res, next) {
    const suite = await SuiteModel.findById(req.params.suite_id);
    res.render("edit_suite", {suite: suite});
}

async function edit_suite(req, res, next) {
    // Unchecked Checkboxes are not sent, so set them to false
    const amenities = ['stove', 'dishwasher', 'television', 'laundry', 'dining_area', 'couches'];
    amenities.forEach(amenity => {
        if(!(amenity in req.body)) {
            req.body[amenity] = false;
        }
    })
    if(req.files) {
        if(!Array.isArray(req.files.photos)){
            req.files.photos = [req.files.photos];
        }
        req.files.photos.forEach(async function(data) {
            const photo = await PhotoModel.createWithData(data);
            SuiteModel.findByIdAndUpdate(
                req.params.suite_id,
                {$push: {"photos": photo}},
                {safe: true, upsert: true}, 
                function(err, model) {
                    console.log(err);
                }
            );
        });
    }
    await SuiteModel.findByIdAndUpdate(req.params.suite_id, req.body);
    res.redirect(`/suite/${req.params.suite_id}`);
}

async function delete_suite(req, res, next) {
    await SuiteModel.findByIdAndDelete(req.params.suite_id);
    res.redirect('/suite/');
}

async function add_listing(req, res, next) {
    res.redirect(url.format({
        pathname: '/listing/add',
        query: {
            'suite': suite._id.toString(),
        },
    }));
}

router.get('/choose', choose_suite_form);
router.post('/choose', choose_suite);
router.get('/add', create_suite_form);
router.post('/add', create_suite);
router.get('/:suite_id/edit', edit_suite_form);
router.post('/:suite_id/edit', edit_suite);
router.get('/:suite_id', view_suite);
router.delete('/:suite_id', delete_suite);
router.get('/:suite_id/addlisting', add_listing);

module.exports = router;