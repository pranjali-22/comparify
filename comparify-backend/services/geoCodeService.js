const axios = require("axios");

exports.getCoordinates = async (address) => {
    try {
        const response = await axios.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            {
                params: {
                    address,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            }
        );

        const location = response.data.results[0]?.geometry?.location;
        if (!location) throw new Error("Address not found");

        return {
            lat: location.lat,
            lng: location.lng,
        };
    } catch (err) {
        console.error("Geocode error:", err.message);
        throw new Error("Could not geocode address");
    }
};