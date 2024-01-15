var express = require("express");
var router = express.Router();

const Venues = require("../models/Venues.model");

// Create Venue
router.post("/create", async (req, res) => {
  try {
    const existingVenue = await Venues.findOne({ address: req.body.address });

    if (existingVenue) {
      return res.status(400).json({
        success: false,
        message: "A venue with this address already exists.",
      });
    }

    const newVenue = new Venues(req.body);
    await newVenue.save();

    return res.status(201).json({ success: true, venue: newVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});

// Edit Venue
router.put("/:venueId/edit", async (req, res) => {
  const venueId = req.params.venueId;

  try {
    const updatedVenue = await Venues.findByIdAndUpdate(venueId, req.body, {
      new: true,
    });

    if (!updatedVenue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }

    return res.status(201).json({ success: true, venue: updatedVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});

// Delete Venue
router.delete("/:venueId/delete", async (req, res) => {
  const venueId = req.params.venueId;

  try {
    const deleteVenue = await Venues.findByIdAndDelete(venueId, req.body, {
      new: true,
    });

    if (!deleteVenue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }

    res.status(201).json({ success: true, venue: deleteVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});

// Get One
router.get("/:venueId/find", async (req, res) => {
  const venueId = req.params.venueId;

  try {
    const findVenue = await Venues.findById(venueId);

    if (!findVenue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }

    return res.status(201).json({ success: true, venue: findVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
});

// Get All
router.get("/findAll", async (req, res) => {
  
    try {
      const findAllVenues = await Venues.find();
  
      if (!findAllVenues) {
        return res
          .status(404)
          .json({ success: false, message: "Venue not found." });
      }
  
      return res.status(201).json({ success: true, venue: findAllVenues });
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  });

module.exports = router;