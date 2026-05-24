require("dotenv").config();
const express      = require("express");
const http         = require("http");
const { Server }   = require("socket.io");
const cors         = require("cors");

const redis         = require("./config/redis");
const compareRoutes = require("./routes/compareRoutes");
const tripRoutes    = require("./routes/tripRoutes");
const priceSocket   = require("./socket/priceSocket");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Comparify running" }));

app.get("/vapid-public-key", (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

app.use("/compare", compareRoutes);
app.use("/trip",    tripRoutes);

priceSocket(io);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

redis.connect()
    .then(() => {
        server.listen(PORT, () => console.log(`[Server] running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("[Redis] failed to connect on boot:", err.message);
        process.exit(1);
    });

const shutdown = async () => {
    console.log("[Server] shutting down...");
    server.close();
    await redis.quit();
    process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT",  shutdown);