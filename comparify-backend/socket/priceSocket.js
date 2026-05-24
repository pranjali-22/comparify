const uberService = require("../services/uberService");
const lyftService = require("../services/lyftService");
const geocodeService = require("../services/geocodeService");

const activeWatchers = new Map();





module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);


            try {
                lastPrices = await fetchPrices(pickup, dropoff);
                socket.emit("prices:update", {
                    type: "initial",
                    timestamp: new Date().toISOString(),
                    comparison: lastPrices,
                });
            } catch (err) {
                console.error("Initial fetch error:", err.message);
                socket.emit("error", { message: "Failed to fetch initial prices" });
                return;
            }

            const interval = setInterval(async () => {
                try {
                    const newPrices = await fetchPrices(pickup, dropoff);
                    const changes = diffPrices(lastPrices, newPrices);

                    if (changes.length > 0) {
                        socket.emit("prices:update", {
                            type: "change",
                            timestamp: new Date().toISOString(),
                            changes,                  // only what changed
                            comparison: newPrices,    // full updated comparison
                        });
                        console.log(`Price change detected for ${socket.id}:`, changes.length, "tiers changed");
                    } else {
                        socket.emit("prices:heartbeat", {
                            timestamp: new Date().toISOString(),
                            message: "Prices unchanged",
                        });
                    }

                    lastPrices = newPrices;
                } catch (err) {
                    console.error("Poll error:", err.message);
                    socket.emit("error", { message: "Failed to refresh prices" });
                }
            }, 30000); // every 30 seconds

            activeWatchers.set(socket.id, { pickup, dropoff, interval });
        });



};