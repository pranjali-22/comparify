const Trip         = require("../models/Trip");


exports.start = (req, res) => {
    const { pickup, dropoff, socketId, pushSubscription } = req.body;

    if (!pickup || !dropoff || !socketId) {
        return res.status(400).json({ error: "pickup, dropoff, and socketId are required" });
    }

    const existing = Trip.getBySocketId(socketId);
    if (existing) Trip.remove(existing.tripId);

    const trip = Trip.create({ pickup, dropoff, socketId, pushSubscription });
    console.log(`[Trip] started ${trip.tripId} for socket ${socketId}`);

    res.status(201).json({ tripId: trip.tripId, message: "Trip watch started" });
};


exports.cancel = (req, res) => {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: "tripId is required" });

    const trip = Trip.get(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    Trip.update(tripId, { status: "cancelled", cancelledAt: new Date().toISOString() });
    console.log(`[Trip] cancelled ${tripId}`);

    setTimeout(() => Trip.remove(tripId), 5000);

    res.json({ message: "Trip cancelled" });
};


exports.end = async (req, res) => {
    const { tripId } = req.body;
    if (!tripId) return res.status(400).json({ error: "tripId is required" });

    const trip = Trip.get(tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    Trip.update(tripId, { status: "ended", endedAt: new Date().toISOString() });
    console.log(`[Trip] ended ${tripId}`);



    setTimeout(() => Trip.remove(tripId), 5000);

    res.json({ message: "Trip ended", tripId });
};


exports.active = (req, res) => {
    const trips = Trip.allActive().map(({ tripId, pickup, dropoff, socketId, startedAt }) => ({
        tripId, pickup, dropoff, socketId, startedAt,   // omit pushSubscription for privacy
    }));
    res.json({ count: trips.length, trips });
};


exports.status = (req, res) => {
    const trip = Trip.get(req.params.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const { pushSubscription, ...safe } = trip;   // don't expose subscription object
    res.json(safe);
};