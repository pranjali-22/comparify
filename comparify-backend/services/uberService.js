const axios = require("axios");
exports.getPrices = async (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
    try {
        const [priceRes, timeRes] = await Promise.allSettled([
            axios.get("https://api.uber.com/v1.2/estimates/price", {
                params: {
                    start_latitude: pickupLat,
                    start_longitude: pickupLng,
                    end_latitude: dropoffLat,
                    end_longitude: dropoffLng,
                },
                headers: { Authorization: `Token ${process.env.UBER_SERVER_TOKEN}` },
            }),
            axios.get("https://api.uber.com/v1.2/estimates/time", {
                params: {
                    start_latitude: pickupLat,
                    start_longitude: pickupLng,
                },
                headers: { Authorization: `Token ${process.env.UBER_SERVER_TOKEN}` },
            }),
        ]);

        const prices = priceRes.status === "fulfilled" ? priceRes.value.data.prices : [];
        const times  = timeRes.status  === "fulfilled" ? timeRes.value.data.times   : [];

        const etaMap = {};
        times.forEach((t) => { etaMap[t.display_name] = Math.round(t.estimate / 60); });

        return prices.map((ride) => ({
            provider:        "uber",
            type:            ride.display_name,           // "UberX", "UberXL", "Uber Black" etc
            price_low:       ride.low_estimate,           // e.g. 44
            price_high:      ride.high_estimate,          // e.g. 56
            eta_minutes:     etaMap[ride.display_name] ?? Math.round(ride.duration / 60),
            surge:           ride.surge_multiplier > 1,
            surge_multiplier: ride.surge_multiplier,
            currency:        ride.currency_code,          // "USD"
        }));
    } catch (err) {
        console.error("Uber API error :", err.response?.data || err.message);
        return [];
    }
};