const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiry  = null;
// current lyt access token
// token expiration time



// connects the backend api to fetch ride prices and estimated arrival time


// gets the OAuth token from lyft
// if token already exists and has not not expired - then this is the token
//  otherwise request token - using a post request and credentials from env
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

// takes the token
// two api requests at the same time
// first find the cost
// find authorisation
// eta - how far nearby drivers are
// eta map lookup - gives the information about the fdrivers
// [
//   {
//      type: "Lyft",
//      price_low: 12,
//      price_high: 15,
//      eta_minutes: 4
//   },
//
//   {
//      type: "Lyft XL",
//      price_low: 20,
//      price_high: 25,
//      eta_minutes: 6
//   }
// ]
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