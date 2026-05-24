const uberService = require("../services/uberService");
const lyftService = require("../services/lyftService");
const geocodeService = require("../services/geocodeService");

exports.compare = async (req, res) => {
    const { pickup, dropoff } = req.body;

    if (!pickup || !dropoff) {
        return res.status(400).json({ error: "pickup and dropoff are required" });
    }

    try {
        const [pickupCoords, dropoffCoords] = await Promise.all([
            geocodeService.getCoordinates(pickup),
            geocodeService.getCoordinates(dropoff),
        ]);

        const [uberPrices, lyftPrices] = await Promise.allSettled([
            uberService.getPrices(
                pickupCoords.lat, pickupCoords.lng,
                dropoffCoords.lat, dropoffCoords.lng
            ),
            lyftService.getPrices(
                pickupCoords.lat, pickupCoords.lng,
                dropoffCoords.lat, dropoffCoords.lng
            ),
        ]);

        const rideMap = {
            standard: {
                uber: uberPrices.value?.find((r) => r.type === "UberX") || null,
                lyft: lyftPrices.value?.find((r) => r.type === "Lyft") || null,
            },
            large: {
                uber: uberPrices.value?.find((r) => r.type === "UberXL") || null,
                lyft: lyftPrices.value?.find((r) => r.type === "Lyft XL") || null,
            },
            premium: {
                uber: uberPrices.value?.find((r) => r.type === "Uber Black") || null,
                lyft: lyftPrices.value?.find((r) => r.type === "Lyft Lux Black") || null,
            },
        };

        const comparison = Object.entries(rideMap).map(([tier, data]) => {
            let cheaper = null;
            if (data.uber && data.lyft) {
                cheaper = data.uber.low <= data.lyft.low ? "uber" : "lyft";
            } else if (data.uber) {
                cheaper = "uber";
            } else if (data.lyft) {
                cheaper = "lyft";
            }

            return { tier, ...data, cheaper };
        });

        
        res.json({
            pickup,
            dropoff,
            pickupCoords,
            dropoffCoords,
            comparison,
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};