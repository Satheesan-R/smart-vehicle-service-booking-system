const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { getBookings } = require("../controllers/bookingController");
const { updateBookingStatus } = require("../controllers/bookingController"); 
const { createBookingUpdate } = require("../controllers/bookingController");
const { getBookingUpdates } = require("../controllers/bookingController");


router.post("/", createBooking);
router.get("/", getBookings);
router.put("/:id/status", updateBookingStatus);
router.post("/:id/updates", createBookingUpdate);
router.get("/:id/updates", getBookingUpdates);

module.exports = router;

