const express = require('express');
const router = express.Router();
const BuildingModel = require('../models/building');
const url = require('url');

function create_building_form(req, res, next) {
    res.render('choose_building', {api_key: process.env.MAPS_JS_API_KEY});
}

async function create_building(req, res, next) {
    let db_building = await BuildingModel.findOne({place_id: req.body.place_id});
    if(!db_building) {
        db_building = await BuildingModel.createWithPlaceID(req.body.place_id);
    }
    res.redirect(url.format({
        pathname: `/suite/choose`,
        query: {
            building_id: db_building._id.toString(),
        }
    }));
}

async function view_properties(req, res, next) {
    const properties = await BuildingModel.find({});
    res.render("properties", {properties: properties, api_key: process.env.MAPS_API_KEY});
}

async function view_property(req, res, next) {
    const property = await BuildingModel.findById(req.params.property_id);
    res.render("property", {property: property, api_key: process.env.MAPS_API_KEY});
}

async function edit_property(req, res, next) {
    await BuildingModel.findByIdAndUpdate(req.params.property_id, req.body);
    res.redirect(`/property/${req.params.property_id}`);
}

async function delete_property(req, res, next) {
    await BuildingModel.findByIdAndDelete(req.params.property_id);
    res.redirect('/property');
}

router.get("/", view_properties);
router.get("/add", create_building_form);
router.post("/add", create_building);
router.get("/:property_id", view_property);
router.put("/:property_id", edit_property);
router.delete("/:property_id", delete_property);

module.exports = router;