const express = require('express');
const router = express.Router();
const BuildingModel = require('../models/building');
const url = require('url');
const axios = require('axios');

function create_building_form(req, res, next) {
    res.render('choose_building');
}

async function create_building(req, res, next) {
    let db_building = await BuildingModel.findOne({place_id: req.body.place_id});
    if(!db_building) {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.place_id}&fields=formatted_address,name,geometry,url,photo,formatted_phone_number,website,rating,user_ratings_total&key=${process.env.MAPS_API_KEY}`);
        let data = response.data.result;
        let building_info = {
            place_id: req.body.place_id,
            name: data.name,
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
            formatted_address: data.formatted_address,
            map_url: data.url,
            photos: (data.photos? data.photos.map(photoElement => photoElement.photo_reference) : undefined),
            phone: data.formatted_phone_number,
            website: data.website,
            rating: data.rating,
            rating_count: data.user_ratings_total,
        };
        db_building = new BuildingModel(building_info);
        await db_building.save();
    }
    console.log(db_building._id.toString());
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