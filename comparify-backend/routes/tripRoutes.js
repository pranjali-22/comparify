const express        = require("express");
const router         = express.Router();
const tripController = require("../controllers/tripController");

router.post("/start",    tripController.start);
router.post("/cancel",   tripController.cancel);
router.post("/end",      tripController.end);
router.get("/active",    tripController.active);
router.get("/:tripId",   tripController.status);

module.exports = router;