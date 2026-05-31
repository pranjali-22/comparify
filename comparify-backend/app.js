require("dotenv").config(); // for env file
const express      = require("express"); // for backend framework
const http         = require("http"); // for http server
const { Server }   = require("socket.io"); // for real time communication
const cors         = require("cors"); // allow frontend to access backend

const redis         = require("./config/redis"); // import redis client
const compareRoutes = require("./routes/compareRoutes");
const tripRoutes    = require("./routes/tripRoutes");
const priceSocket   = require("./socket/priceSocket");

const app    = express(); // create express app
const server = http.createServer(app); // wraps server in http server
const io     = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});
// creates socket server


app.use(cors());
app.use(express.json()); // allows json to be read and parse in body

app.get("/", (req, res) => res.json({ status: "Comparify running" }));

app.get("/vapid-public-key", (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});
// sends a valid ke for push notifications

app.use("/compare", compareRoutes);
app.use("/trip",    tripRoutes);

// socket setup
// intialise live socket evernts
// error handling middleware
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

process.on("SIGTERM", shutdown); // Ctrl + C
process.on("SIGINT",  shutdown); // Docker

// graceful shutdown when app stops running