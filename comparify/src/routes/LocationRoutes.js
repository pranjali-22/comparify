const express = require("express");
const router = express.Router();
const locationController = require("../controllers/LocationController");

router.get("/", locationController.search);

module.exports = router;