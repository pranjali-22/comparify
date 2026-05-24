const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiry  = null;

const getLyftToken = async () => {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) return cachedToken;

    const response = await axios.post(
        "https://api.lyft.com/oauth/token",
        qs.stringify({ grant_type: "client_credentials", scope: "public" }),
        {
            auth: {
                username: process.env.LYFT_CLIENT_ID,
                password: process.env.LYFT_CLIENT_SECRET,
            },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
    );

    cachedToken  = response.data.access_token;
    tokenExpiry  = Date.now() + (response.data.expires_in - 60) * 1000;
    return cachedToken;
};


exports.getPrices = async (pickupLat, pickupLng, dropoffLat, dropoffLng) => {
    try {
        const token = await getLyftToken();

        const [costRes, etaRes] = await Promise.allSettled([
            axios.get("https://api.lyft.com/v1/cost", {
                params: {
                    start_lat: pickupLat,
                    start_lng: pickupLng,
                    end_lat:   dropoffLat,
                    end_lng:   dropoffLng,
                },
                headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("https://api.lyft.com/v1/eta", {
                params: { lat: pickupLat, lng: pickupLng },
                headers: { Authorization: `Bearer ${token}` },
            }),
        ]);

        const costs = costRes.status === "fulfilled" ? costRes.value.data.cost_estimates : [];
        const etas  = etaRes.status  === "fulfilled" ? etaRes.value.data.eta_estimates   : [];

        const etaMap = {};
        etas.forEach((e) => { etaMap[e.ride_type] = Math.round(e.eta_seconds / 60); });

        return costs.map((ride) => ({
            provider:         "lyft",
            type:             ride.display_name,                              // "Lyft", "Lyft XL" etc
            price_low:        Math.round(ride.estimated_cost_cents_min / 100),
            price_high:       Math.round(ride.estimated_cost_cents_max / 100),
            eta_minutes:      etaMap[ride.ride_type] ?? null,
            surge:            !!ride.primetime_percentage && ride.primetime_percentage !== "0%",
            surge_multiplier: ride.primetime_percentage || "0%",
            currency:         "USD",
        }));
    } catch (err) {
        console.error("Lyft API error:", err.response?.data || err.message);
        return [];
    }
};