const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { getBookings } = require("../controllers/bookingController");
const { updateBookingStatus } = require("../controllers/bookingController"); 
const { createBookingUpdate } = require("../controllers/bookingController");
const { getBookingUpdates } = require("../controllers/bookingController");
const { verifyToken, authorize } = require("../middleware/auth");

router.use(verifyToken);
router.post("/", authorize("client"), createBooking);
router.get("/", authorize("client", "garage"), getBookings);
router.put("/:id/status", authorize("garage"), updateBookingStatus);
router.post("/:id/updates", authorize("garage"), createBookingUpdate);
router.get("/:id/updates", authorize("client", "garage"), getBookingUpdates);

module.exports = router;

