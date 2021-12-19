const waterloo = {
    lat: 43.4643,
    lng: -80.5204
};

const defaultBounds = {
    north: waterloo.lat + 0.1,
    south: waterloo.lat - 0.1,
    east: waterloo.lng + 0.1,
    west: waterloo.lng - 0.1,
}

const options = {
    bounds: defaultBounds,
    componentRestrictions: {country: "ca" },
    fields: ["place_id"],
    strictBounds: false,
}

const input = document.getElementById('autocomplete');
const autocomplete = new google.maps.places.Autocomplete(input, options);

autocomplete.addListener("place_changed", function() {
    const place = autocomplete.getPlace();
    document.getElementById('place_id').value = place.place_id;
});