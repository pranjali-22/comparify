const axios = require("axios");

exports.getPrices = async (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
    try {
        const response = await axios.get(
            "https://api.uber.com/v1.2/estimates/price",
            {
                params: {
                    start_latitude: pickupLat,
                    start_longitude: pickupLng,
                    end_latitude: dropoffLat,
                    end_longitude: dropoffLng,
                },
                headers: {
                    Authorization: `Bearer ${process.env.UBER_ACCESS_TOKEN}`,
                },
            }
        );

        return response.data.prices.map((ride) => ({
            provider: "Uber",
            type: ride.display_name,
            low: ride.low_estimate,
            high: ride.high_estimate,
            duration: Math.round(ride.duration / 60),
            surge: ride.surge_multiplier > 1,
            surgeMultiplier: ride.surge_multiplier,
        }));
    } catch (err) {
        console.error("Uber API error:", err.response?.data || err.message);
        return [];
    }
};