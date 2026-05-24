require("dotenv").config();
const express      = require("express");
const http         = require("http");
const { Server }   = require("socket.io");
const cors         = require("cors");

const compareRoutes = require("./routes/compareRoutes");
const priceSocket  = require("./socket/priceSocket");
const tripRoutes    = require("./routes/tripRoutes");


const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Comparify running" }));

app.use("/compare", compareRoutes);
app.use("/trip",    tripRoutes);

priceSocket(io);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));