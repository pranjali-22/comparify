const axios = require("axios");
// axios - http api requests


// calls google api
// takes address and api key
// returns the lat and long of the address
// throw error if address not found

// Basiclaly this service has two functions -
// one takes address returns the lat and long and
// other takes corrdinates and returns address
// both of them use google map api to do this
exports.getCoordinates = async (input) => {
    if (typeof input === "object" && input.lat && input.lng) {
        return { lat: input.lat, lng: input.lng };
    }
    try {
        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            { params: { address: input, key: process.env.GOOGLE_MAPS_API_KEY } }
        );

        const location = response.data.results[0]?.geometry?.location;
        if (!location) throw new Error(`Address not found: ${input}`);

        return { lat: location.lat, lng: location.lng };
    } catch (err) {
        console.error("Geocode error:", err.message);
        throw new Error("Could not geocode address");
    }
};

// get address from coordinates

exports.getAddress = async (lat, lng) => {
    try {
        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            { params: { latlng: `${lat},${lng}`, key: process.env.GOOGLE_MAPS_API_KEY } }
        );

        return response.data.results[0]?.formatted_address || "Current Location";
    } catch (err) {
        console.error("Reverse geocode error:", err.message);
        return "Current Location";
    }
};