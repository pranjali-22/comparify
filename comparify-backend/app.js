require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");

const app = express();
connectDB();

app.use(express.json());

app.get("/", (req, res) => res.send("Comparify backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
