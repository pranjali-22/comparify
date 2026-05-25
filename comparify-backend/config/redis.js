const { createClient } = require("redis");

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error",   (err) => console.error("[Redis] error:", err.message));
client.on("connect", ()    => console.log("[Redis] connected"));

module.exports = client;
// make a new client and export that client to files