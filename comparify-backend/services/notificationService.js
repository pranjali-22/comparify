const webpush = require("web-push");


webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);


const send = async (subscription, payload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
            // subscrption expired / deleted subscription
            // user unsubscribed
            console.warn("Push subscription gone:", err.message);
            return { expired: true };
        }
        console.error("Push error:", err.message);
        throw err;
    }
};


const priceDrop = ({ provider, type, oldPrice, newPrice, pickup, dropoff }) => ({
    title: ` Price drop — ${provider === "uber" ? "Uber" : "Lyft"} ${type}`,
    body:  `$${oldPrice} → $${newPrice} · ${pickup} → ${dropoff}`,
    tag:   `price-drop-${provider}-${type}`,
    data:  { event: "price_drop", provider, type, oldPrice, newPrice },
});

const cheapestChanged = ({ provider, type, price, pickup, dropoff }) => ({
    title: ` Cheapest ride changed`,
    body:  `${provider === "uber" ? "Uber" : "Lyft"} ${type} is now cheapest at $${price} · ${pickup} → ${dropoff}`,
    tag:   "cheapest-changed",
    data:  { event: "cheapest_changed", provider, type, price },
});

const surgeStarted = ({ provider, type, multiplier, pickup, dropoff }) => ({
    title: ` Surge started — ${provider === "uber" ? "Uber" : "Lyft"} ${type}`,
    body:  `${multiplier} surge pricing is now active · ${pickup} → ${dropoff}`,
    tag:   `surge-${provider}-${type}`,
    data:  { event: "surge_started", provider, type, multiplier },
});

const surgeEnded = ({ provider, type, pickup, dropoff }) => ({
    title: `Surge ended — ${provider === "uber" ? "Uber" : "Lyft"} ${type}`,
    body:  `Back to normal pricing · ${pickup} → ${dropoff}`,
    tag:   `surge-${provider}-${type}`,
    data:  { event: "surge_ended", provider, type },
});

const tripEndedConfirmation = ({ pickup, dropoff }) => ({
    title: ` Trip watch ended`,
    body:  `Stopped monitoring prices for ${pickup} → ${dropoff}`,
    tag:   "trip-ended",
    data:  { event: "trip_ended" },
});


module.exports = {
    send,
    payloads: {
        priceDrop,
        cheapestChanged,
        surgeStarted,
        surgeEnded,
        tripEndedConfirmation,
    },
};