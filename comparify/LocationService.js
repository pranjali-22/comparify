const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 });

const PLACES_AUTOCOMPLETE_URL = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

async function getPlaceDetails(placeId, apiKey) {
    const res = await axios.get(PLACE_DETAILS_URL, {
        params: {
            place_id: placeId,
            fields: "geometry,formatted_address,name",
            key: apiKey,
        },
    });
    const detail = res.data.result;
    return {
        lat: detail.geometry.location.lat,
        lng: detail.geometry.location.lng,
        fullAddress: detail.formatted_address,
    };
}

async function searchLocations(query, apiKey) {
    // Return from cache if available
    const cached = cache.get(query);
    if (cached) return { source: "cache", results: cached };

    // Step 1: Autocomplete
    const autocompleteRes = await axios.get(PLACES_AUTOCOMPLETE_URL, {
        params: {
            input: query,
            key: apiKey,
            language: "en",
            // components: "country:in",  // uncomment to restrict to India
        },
    });

    const status = autocompleteRes.data.status;
    if (status !== "OK" && status !== "ZERO_RESULTS") {
        throw new Error(`Google API error: ${status}`);
    }

    // Step 2: Get details (lat/lng) for each prediction
    const predictions = autocompleteRes.data.predictions;
    const results = await Promise.all(
        predictions.map(async (place) => {
            try {
                const details = await getPlaceDetails(place.place_id, apiKey);
                return {
                    id: place.place_id,
                    name: place.structured_formatting.main_text,
                    fullAddress: details.fullAddress,
                    lat: details.lat,
                    lng: details.lng,
                };
            } catch {
                return null;
            }
        })
    );

    const filtered = results.filter(Boolean);
    cache.set(query, filtered);

    return { source: "api", results: filtered };
}

module.exports = { searchLocations };