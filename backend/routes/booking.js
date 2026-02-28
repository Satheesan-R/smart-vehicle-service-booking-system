const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/bookingController");
const { updateBookingStatus } = require("../controllers/bookingController"); 


router.post("/", createBooking);
router.put("/:id/status", updateBookingStatus);

module.exports = router;

