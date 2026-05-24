const uberService = require("../services/uberService");
const lyftService = require("../services/lyftService");
const geocodeService = require("../services/geocodeService");

const activeWatchers = new Map();




    const uberPrices = uberResult.status === "fulfilled" ? uberResult.value : [];
    const lyftPrices = lyftResult.status === "fulfilled" ? lyftResult.value : [];


    return Object.entries(tierMap).map(([tier, data]) => {
        let cheaper = null;
        if (data.uber && data.lyft) {
            cheaper = data.uber.low <= data.lyft.low ? "uber" : "lyft";
        } else if (data.uber) cheaper = "uber";
        else if (data.lyft) cheaper = "lyft";

        return { tier, ...data, cheaper };
    });
};





module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on("watch:prices", async ({ pickup, dropoff }) => {
            if (!pickup || !dropoff) {
                return socket.emit("error", { message: "pickup and dropoff are required" });
            }

            if (activeWatchers.has(socket.id)) {
                clearInterval(activeWatchers.get(socket.id).interval);
            }

            console.log(`Watching prices for ${socket.id}: ${pickup} → ${dropoff}`);

            let lastPrices = null;

            // Immediately fetch and send first result
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

            // Poll every 30 seconds and emit only if prices changed
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
                        // Let client know we checked even if nothing changed
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

        /**
         * Client sends this to stop watching (e.g. user leaves the screen)
         */
        socket.on("watch:stop", () => {
            if (activeWatchers.has(socket.id)) {
                clearInterval(activeWatchers.get(socket.id).interval);
                activeWatchers.delete(socket.id);
                console.log(`Stopped watching for ${socket.id}`);
            }
            socket.emit("prices:stopped", { message: "Price watching stopped" });
        });

        /**
         * Clean up when client disconnects
         */
        socket.on("disconnect", () => {
            if (activeWatchers.has(socket.id)) {
                clearInterval(activeWatchers.get(socket.id).interval);
                activeWatchers.delete(socket.id);
            }
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};