require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const compareRoutes = require("./routes/compareRoutes");
const priceSocket = require("./socket/priceSocket");

const app = express();
const server = http.createServer(app);  // wrap express in http server for socket.io

const io = new Server(server, {
    cors: {
        origin: "*",  // lock this down to your frontend URL in production
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(express.json());

app.use("/compare", compareRoutes);

priceSocket(io);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));