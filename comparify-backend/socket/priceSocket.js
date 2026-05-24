const { buildComparison } = require("../controllers/compareController");

const activeWatchers = new Map();

const POLL_INTERVAL_MS = 30000; // 30 seconds


const diffResult = (oldResult, newResult) => {
    const changes = [];

    newResult.uber.forEach((newRide) => {
        const oldRide = oldResult.uber.find((r) => r.type === newRide.type);
        if (!oldRide) return;
        if (
            oldRide.price_low  !== newRide.price_low  ||
            oldRide.price_high !== newRide.price_high ||
            oldRide.surge      !== newRide.surge       ||
            oldRide.eta_minutes !== newRide.eta_minutes
        ) {
            changes.push({
                provider: "uber",
                type: newRide.type,
                previous: { price_low: oldRide.price_low, price_high: oldRide.price_high, surge: oldRide.surge, eta_minutes: oldRide.eta_minutes },
                current:  { price_low: newRide.price_low, price_high: newRide.price_high, surge: newRide.surge, eta_minutes: newRide.eta_minutes },
            });
        }
    });

    newResult.lyft.forEach((newRide) => {
        const oldRide = oldResult.lyft.find((r) => r.type === newRide.type);
        if (!oldRide) return;
        if (
            oldRide.price_low  !== newRide.price_low  ||
            oldRide.price_high !== newRide.price_high ||
            oldRide.surge      !== newRide.surge       ||
            oldRide.eta_minutes !== newRide.eta_minutes
        ) {
            changes.push({
                provider: "lyft",
                type: newRide.type,
                previous: { price_low: oldRide.price_low, price_high: oldRide.price_high, surge: oldRide.surge, eta_minutes: oldRide.eta_minutes },
                current:  { price_low: newRide.price_low, price_high: newRide.price_high, surge: newRide.surge, eta_minutes: newRide.eta_minutes },
            });
        }
    });

    const cheapestChanged =
        oldResult.cheapest?.provider !== newResult.cheapest?.provider ||
        oldResult.cheapest?.type     !== newResult.cheapest?.type;

    return { changes, cheapestChanged };
};

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.on("watch:prices", async ({ pickup, dropoff }) => {
            if (!pickup || !dropoff) {
                return socket.emit("error", { message: "pickup and dropoff are required" });
            }

            if (activeWatchers.has(socket.id)) {
                clearInterval(activeWatchers.get(socket.id));
            }

            let lastResult = null;

            try {
                lastResult = await buildComparison(pickup, dropoff);
                socket.emit("prices:initial", lastResult);
                console.log(`Initial prices sent to ${socket.id}`);
            } catch (err) {
                socket.emit("error", { message: "Failed to fetch prices" });
                return;
            }

            const interval = setInterval(async () => {
                try {
                    const newResult = await buildComparison(pickup, dropoff);
                    const { changes, cheapestChanged } = diffResult(lastResult, newResult);

                    if (changes.length > 0 || cheapestChanged) {
                        socket.emit("prices:changed", {
                            timestamp:       newResult.timestamp,
                            changes,                    // exactly what changed and by how much
                            cheapestChanged,            // true if cheapest provider/tier flipped
                            cheapest:        newResult.cheapest,
                            uber:            newResult.uber,
                            lyft:            newResult.lyft,
                        });
                        console.log(`Price change for ${socket.id}: ${changes.length} rides changed`);
                    } else {
                        socket.emit("prices:heartbeat", { timestamp: newResult.timestamp });
                    }

                    lastResult = newResult;
                } catch (err) {
                    socket.emit("error", { message: "Failed to refresh prices" });
                }
            }, POLL_INTERVAL_MS);

            activeWatchers.set(socket.id, interval);
        });


        socket.on("watch:stop", () => {
            if (activeWatchers.has(socket.id)) {
                clearInterval(activeWatchers.get(socket.id));
                activeWatchers.delete(socket.id);
            }
            socket.emit("prices:stopped");
            console.log(`Watch stopped for ${socket.id}`);
        });


        socket.on("disconnect", () => {
            if (activeWatchers.has(socket.id)) {
                clearInterval(activeWatchers.get(socket.id));
                activeWatchers.delete(socket.id);
            }
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};