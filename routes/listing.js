const express = require('express');
const router = express.Router();
const listingModel = require('../models/listing');
const BuildingModel = require('../models/building');
const axios = require('axios');

function add_building(req, res, next) {
    BuildingModel.findOne({place_id: req.body.place_id}, function(err, result) {
        if(err) {
            res.status(500).send(err);
        }
        if(!result) {
            try {
                axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.place_id}&fields=formatted_address,name,geometry&key=${process.env.MAPS_API_KEY}`)
                .then(response => response.data.result)
                .then(data => {
                    let building = {
                        place_id: req.body.place_id,
                        name: data.name,
                        latitude: data.geometry.location.lat,
                        longitude: data.geometry.location.lng,
                        formatted_address: data.formatted_address,
                    }
                    let db_building = new BuildingModel(building);
                    // Save the building into the Database
                    db_building.save();
                    // pass the mongo id of the building into the request
                    req.body.location = db_building._id;
                    next();
                });
            } catch(err) {
                res.status(500).send(err);
            }
        } else {
            req.body.location = result._id;
            next();
        }
    });
}

async function add_listing(req, res) {
    req.body.moveInDate = new Date(req.body.moveInDate).toDateString();
    req.body.moveOutDate = new Date(req.body.moveOutDate).toDateString();
    const listing = new listingModel(req.body);
    try {
        await listing.save();
        res.send(listing);
    } catch(error) {
        res.status(500).send(error);
    }
}

function add_listing_form(req, res) {
    try {
        res.render('addListing');
    } catch(error) {
        res.status(500).send(error);
    }
}

async function display_listing(req, res) {
    const listings = await listingModel.find({});
    try {
        res.render('viewListing', {listings: listings});
    } catch (error) {
        res.status(500).send(error);
    }
}

async function display_buildings(req, res) {
    const buildings = await BuildingModel.find({});
    res.render('properties', {buildings: buildings});
}

router.get("/properties", display_buildings);
router.post("/add", add_building, add_listing);
router.get("/add", add_listing_form);
router.get("/", display_listing);

module.exports = router;