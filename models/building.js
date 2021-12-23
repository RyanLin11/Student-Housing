const mongoose = require('mongoose');
const axios = require('axios');

const BuildingSchema = new mongoose.Schema({
    place_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    formatted_address: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    rating: {
        type: Number,
    },
    rating_count: {
        type: Number
    }
});

BuildingSchema.statics.CreateWithPlaceID = async function(place_id) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.place_id}&fields=formatted_address,name,geometry,url,photo,formatted_phone_number,website,rating,user_ratings_total&key=${process.env.MAPS_API_KEY}`);
    let data = response.data.result;
    let building_info = {
        place_id: place_id,
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
    const building = new BuildingModel(building_info);
    await building.save();
    return building;
}

const Building = mongoose.model("Building", BuildingSchema);

module.exports = Building;