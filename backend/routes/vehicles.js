const express = require("express");
const { getVehicles, createVehicle } = require("../controllers/vehicleController");
const { verifyToken, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);
router.get("/", authorize("client"), getVehicles);
router.post("/", authorize("client"), createVehicle);

module.exports = router;
