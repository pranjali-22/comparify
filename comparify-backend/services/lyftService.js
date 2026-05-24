const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiry = null;

const getLyftToken = async () => {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const response = await axios.post(
        "https://api.lyft.com/oauth/token",
        qs.stringify({
            grant_type: "client_credentials",
            scope: "public",
        }),
        {
            auth: {
                username: process.env.LYFT_CLIENT_ID,
                password: process.env.LYFT_CLIENT_SECRET,
            },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // refresh 1 min early
    return cachedToken;
};

exports.getPrices = async (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
    try {
        const token = await getLyftToken();

        const response = await axios.get("https://api.lyft.com/v1/cost", {
            params: {
                start_lat: pickupLat,
                start_lng: pickupLng,
                end_lat: dropoffLat,
                end_lng: dropoffLng,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data.cost_estimates.map((ride) => ({
            provider: "Lyft",
            type: ride.display_name,
            low: Math.round(ride.estimated_cost_cents_min / 100),   
            high: Math.round(ride.estimated_cost_cents_max / 100),
            duration: Math.round(ride.estimated_duration_seconds / 60),
            surge: ride.is_valid_estimate === false,
            surgeMultiplier: ride.primetime_percentage || "0%",
        }));
    } catch (err) {
        console.error("Lyft API error:", err.response?.data || err.message);
        return [];
    }
};