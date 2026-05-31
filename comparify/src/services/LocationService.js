const axios = require("axios");
const LocationModel = require("../models/locationModel");

const PLACES_TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

async function searchLocations(query, apiKey) {
    const res = await axios.get(PLACES_TEXT_SEARCH_URL, {
        params: {
            query,
            key: apiKey,
            language: "en",
        },
    });

    const status = res.data.status;
    if (status !== "OK" && status !== "ZERO_RESULTS") {
        throw new Error(`Google API error: ${status}`);
    }

    return res.data.results.map((place) => new LocationModel(place));
}

module.exports = { searchLocations };