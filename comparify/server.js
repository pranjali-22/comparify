require("dotenv").config();
const express = require("express");
const { searchLocations } = require("./locationService");

const app = express();
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get("/api/locations", async (req, res) => {
    const query = req.query.q?.trim();

    if (!query || query.length < 2) {
        return res.status(400).json({ error: "Query must be at least 2 characters" });
    }

    if (!GOOGLE_API_KEY) {
        return res.status(500).json({ error: "Google API key not configured" });
    }

    try {
        const data = await searchLocations(query, GOOGLE_API_KEY);
        return res.json(data);
    } catch (error) {
        console.error("Location search error:", error.message);
        return res.status(500).json({ error: "Failed to fetch locations" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));