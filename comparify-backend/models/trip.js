const { v4: uuidv4 } = require("uuid");


const trips = new Map();

const create = ({ pickup, dropoff, socketId, pushSubscription }) => {
    const tripId = uuidv4();
    trips.set(tripId, {
        tripId,
        pickup,
        dropoff,
        socketId,
        pushSubscription: pushSubscription || null,
        status:    "watching",
        startedAt: new Date().toISOString(),
        endedAt:   null,
        cancelledAt: null,
    });
    return trips.get(tripId);
};

const get = (tripId) => trips.get(tripId) || null;

const getBySocketId = (socketId) => {
    for (const trip of trips.values()) {
        if (trip.socketId === socketId && trip.status === "watching") return trip;
    }
    return null;
};

const allActive = () =>
    [...trips.values()].filter((t) => t.status === "watching");

const update = (tripId, fields) => {
    const trip = trips.get(tripId);
    if (!trip) return null;
    Object.assign(trip, fields);
    trips.set(tripId, trip);
    return trip;
};

const remove = (tripId) => trips.delete(tripId);

module.exports = { create, get, getBySocketId, allActive, update, remove };