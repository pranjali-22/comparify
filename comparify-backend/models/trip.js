const { v4: uuidv4 } = require("uuid");
const redis          = require("../config/redis");

const PREFIX  = "trip:";
const IDX_SOCKET = "idx:socket:";
const TTL_SEC = 60 * 60 * 24;

const key     = (tripId)  => `${PREFIX}${tripId}`;
const sockKey = (socketId) => `${IDX_SOCKET}${socketId}`;


const serialize = (obj) => JSON.stringify(obj);
const deserialize = (str) => str ? JSON.parse(str) : null;

// functions to convert javascript objects to string and string to javascript objects



const create = async ({ pickup, dropoff, socketId, pushSubscription }) => {
    const tripId = uuidv4();
    const trip = {
        tripId,
        pickup,
        dropoff,
        socketId,
        pushSubscription: pushSubscription || null,
        status:      "watching",
        startedAt:   new Date().toISOString(),
        endedAt:     null,
        cancelledAt: null,
    };

    await redis.set(key(tripId), serialize(trip), { EX: TTL_SEC });
    await redis.set(sockKey(socketId), tripId,    { EX: TTL_SEC });

    return trip;
};

const get = async (tripId) => {
    const raw = await redis.get(key(tripId));
    return deserialize(raw);
};

const getBySocketId = async (socketId) => {
    const tripId = await redis.get(sockKey(socketId));
    if (!tripId) return null;
    const trip = await get(tripId);
    return trip?.status === "watching" ? trip : null;
};

const allActive = async () => {
    const keys = await redis.keys(`${PREFIX}*`);
    if (!keys.length) return [];

    const raws = await redis.mGet(keys);
    return raws
        .map(deserialize)
        .filter((t) => t?.status === "watching");
};

const update = async (tripId, fields) => {
    const trip = await get(tripId);
    if (!trip) return null;
    const updated = { ...trip, ...fields };
    await redis.set(key(tripId), serialize(updated), { EX: TTL_SEC });
    return updated;
};

const remove = async (tripId) => {
    const trip = await get(tripId);
    if (trip?.socketId) await redis.del(sockKey(trip.socketId));
    await redis.del(key(tripId));
};

module.exports = { create, get, getBySocketId, allActive, update, remove };