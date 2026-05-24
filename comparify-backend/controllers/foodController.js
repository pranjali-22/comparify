const doordashService = require("../services/doordashService");
const uberEatsService = require("../services/uberEatsService");
const comparator = require("../utils/comparator");

exports.compareFood = async (req, res) => {
    try {
        const query = req.body.query;
        const [doordashData, uberEatsData] = await Promise.all([
            doordashService.search(query),
            uberEatsService.search(query),
        ]);

        const results = comparator([doordashData, uberEatsData]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
