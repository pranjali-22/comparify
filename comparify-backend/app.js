require("dotenv").config();
const express = require("express");
const compareRoutes = require("./routes/compareRoutes");

const app = express();
app.use(express.json());
app.use("/compare", compareRoutes);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));