const { Queue, Worker } = require("bullmq");
const notification = require("../services/notificationService");
const Trip = require("../models/Trip");

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
};

//  connection for bullmq
// each notification has a different startegy
// delay - retry waits longer


const RETRY_CONFIGS = {
    price_drop:       { attempts: 3, backoff: { type: "exponential", delay: 2000 } },
    cheapest_changed: { attempts: 3, backoff: { type: "exponential", delay: 2000 } },
    surge_started:    { attempts: 5, backoff: { type: "exponential", delay: 1000 } },
    surge_ended:      { attempts: 2, backoff: { type: "fixed",       delay: 3000 } },
    trip_ended:       { attempts: 2, backoff: { type: "fixed",       delay: 5000 } },
};

const notifQueue = new Queue("notifications", {
    connection,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail:     200,
    },
});

// creates a queue in redis - called notification
// only keeps last 100
//

const enqueue = (tripId, type, payload) => {
    const retryConfig = RETRY_CONFIGS[type] || { attempts: 2 };
    return notifQueue.add(type, { tripId, type, payload }, retryConfig);
};
// adds to the queue

const worker = new Worker(
    "notifications",
    async (job) => {
        const { tripId, payload } = job.data;

        const trip = await Trip.get(tripId);
        if (!trip?.pushSubscription) {
            return;
        }

        await notification.send(trip.pushSubscription, payload);
    },
    {
        connection,
        concurrency: 25,                               // 25 parallel push calls at most
        limiter:     { max: 100, duration: 1000 },     // rate-limit: 100 jobs/sec
    }
);

worker.on("completed", (job) => {
    console.log(`[Notif] job ${job.id} (${job.name}) completed`);
});

worker.on("failed", async (job, err) => {
    if (err.statusCode === 410 || err.statusCode === 404) {
        const { tripId } = job.data;
        await Trip.update(tripId, { pushSubscription: null }).catch(() => {});
        console.log(`[Notif] removed expired subscription for trip ${tripId}`);
        return;
    }
    console.error(`[Notif] job ${job.id} failed (attempt ${job.attemptsMade}): ${err.message}`);
});

worker.on("error", (err) => {
    console.error("[Notif] worker error:", err.message);
});

module.exports = { notifQueue, enqueue };