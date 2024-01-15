var express = require("express");
var router = express.Router();

const Venues = require("../models/Venues.model");

// Create Venue
router.post("/venue", async (req, res) => {
  try {
    const existingVenue = Venues.findOne({ address: req.body.address });

    if (existingVenue) {
      return res.status(400).json({
        success: false,
        message: "A venue with this address already exists.",
      });
    }

    const newVenue = new Venues(req.body);
    await newVenue.save();

    res.status(201).json({ success: true, venue: newVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;