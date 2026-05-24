const { Queue, Worker } = require("bullmq");
const notification = require("../services/notificationService");
const Trip = require("../models/Trip");
const connection = { host: process.env.REDIS_HOST, port: 6379 };

const notifQueue = new Queue("notifications", { connection });

const worker = new Worker("notifications", async (job) => {
    const { tripId, type, payload } = job.data;

    const trip = await Trip.get(tripId);
    if (!trip?.pushSubscription) return;

    await notification.send(trip.pushSubscription, payload);
}, {
    connection,
    concurrency: 25,
    limiter: { max: 100, duration: 1000 },
});

worker.on("failed", (job, err) => {
    console.error(`[Notif] job ${job.id} failed: ${err.message}`);
});

module.exports = notifQueue;