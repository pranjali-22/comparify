require("dotenv").config();

const express     = require("express");
const http        = require("http");
const { Server }  = require("socket.io");
const cors        = require("cors");

const compareRoutes      = require("./routes/compareRoutes");


const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
    cors: {
        origin:  process.env.CLIENT_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/compare",       compareRoutes);


app.get("/api/vapid-public-key", (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

priceSocket(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Comparify backend running on http://localhost:${PORT}`);
});