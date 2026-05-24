const uberService     = require("../services/uberService");
const lyftService     = require("../services/lyftService");
const geocodeService  = require("../services/geocodeService");


const buildComparison = async (pickup, dropoff) => {
    const [pickupCoords, dropoffCoords] = await Promise.all([
        geocodeService.getCoordinates(pickup),
        geocodeService.getCoordinates(dropoff),
    ]);

    const pickupLabel =
        typeof pickup === "string"
            ? pickup
            : await geocodeService.getAddress(pickupCoords.lat, pickupCoords.lng);

    const [uberResult, lyftResult] = await Promise.allSettled([
        uberService.getPrices(
            pickupCoords.lat, pickupCoords.lng,
            dropoffCoords.lat, dropoffCoords.lng
        ),
        lyftService.getPrices(
            pickupCoords.lat, pickupCoords.lng,
            dropoffCoords.lat, dropoffCoords.lng
        ),
    ]);

    const uberRides = uberResult.status === "fulfilled" ? uberResult.value : [];
    const lyftRides = lyftResult.status === "fulfilled" ? lyftResult.value : [];

    const allRides = [...uberRides, ...lyftRides];
    let cheapest = null;

    if (allRides.length > 0) {
        const cheapestRide = allRides.reduce((min, ride) =>
            ride.price_low < min.price_low ? ride : min
        );
        cheapest = {
            provider: cheapestRide.provider,
            type:     cheapestRide.type,
            price:    cheapestRide.price_low,
        };
    }

    return {
        pickup:         pickupLabel,
        dropoff:        typeof dropoff === "string" ? dropoff : `${dropoffCoords.lat},${dropoffCoords.lng}`,
        pickupCoords,
        dropoffCoords,
        cheapest,               // { provider, type, price } — used by frontend to flag in color
        uber:           uberRides,
        lyft:           lyftRides,
        timestamp:      new Date().toISOString(),
    };
};

exports.compare = async (req, res) => {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
        return res.status(400).json({ error: "pickup and dropoff are required" });
    }

    try {
        const result = await buildComparison(pickup, dropoff);
        res.json(result);
    } catch (err) {
        console.error("Compare error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.buildComparison = buildComparison;