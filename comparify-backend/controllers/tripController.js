const Trip         = require("../models/Trip");
const notification = require("../services/notificationService");

exports.start = async (req, res) => {
    const { pickup, dropoff, socketId, pushSubscription } = req.body;

    if (!pickup || !dropoff || !socketId) {
        return res.status(400).json({ error: "pickup, dropoff, and socketId are required" });
    }

    const existing = await Trip.getBySocketId(socketId);
    if (existing) await Trip.remove(existing.tripId);

    const trip = await Trip.create({ pickup, dropoff, socketId, pushSubscription });
    console.log(`[Trip] started ${trip.tripId} for socket ${socketId}`);

    res.status(201).json({ tripId: trip.tripId, message: "Trip watch started" });
};

exports.cancel = async (req, res) => {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: "tripId is required" });

    const trip = await Trip.get(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    await Trip.update(tripId, { status: "cancelled", cancelledAt: new Date().toISOString() });
    console.log(`[Trip] cancelled ${tripId}`);

    setTimeout(() => Trip.remove(tripId), 5000);
    res.json({ message: "Trip cancelled" });
};

exports.end = async (req, res) => {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: "tripId is required" });

    const trip = await Trip.get(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    await Trip.update(tripId, { status: "ended", endedAt: new Date().toISOString() });
    console.log(`[Trip] ended ${tripId}`);

    if (trip.pushSubscription) {
        const payload = notification.payloads.tripEndedConfirmation({
            pickup: trip.pickup, dropoff: trip.dropoff,
        });
        await notification.send(trip.pushSubscription, payload).catch(() => {});
    }

    setTimeout(() => Trip.remove(tripId), 5000);
    res.json({ message: "Trip ended", tripId });
};

exports.active = async (req, res) => {
    const trips = await Trip.allActive();
    const safe  = trips.map(({ tripId, pickup, dropoff, socketId, startedAt }) => ({
        tripId, pickup, dropoff, socketId, startedAt,
    }));
    res.json({ count: safe.length, trips: safe });
};

exports.status = async (req, res) => {
    const trip = await Trip.get(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const { pushSubscription, ...safe } = trip;
    res.json(safe);
};