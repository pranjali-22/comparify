const express = require("express");
const { compareFood } = require("../controllers/foodController");
const router = express.Router();

router.post("/compare", compareFood);

module.exports = router;
