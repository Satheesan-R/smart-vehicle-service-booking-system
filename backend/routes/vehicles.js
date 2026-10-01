const express = require("express");
const { getVehicles, createVehicle } = require("../controllers/vehicleController");

const router = express.Router();

router.get("/", getVehicles);
router.post("/", createVehicle);

module.exports = router;
