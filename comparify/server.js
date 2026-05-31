require("dotenv").config();
const express = require("express");
const locationRoutes = require("./src/routes/LocationRoutes");

const app = express();
app.use(express.json());

app.use("/api/locations", locationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));