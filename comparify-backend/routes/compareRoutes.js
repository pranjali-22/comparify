const express = require("express");
const router = express.Router();
const compareController = require("../controllers/compareController");

router.post("/", compareController.compare);

module.exports = router;