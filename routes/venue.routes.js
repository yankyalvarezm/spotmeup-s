var express = require("express");
var router = express.Router();

const Venues = require("../models/Venues.model");
const { default: mongoose } = require("mongoose");

// Create Venue
router.post("/create", async (req, res) => {
  const { name, maxCapacity, address, contact } = req.body;
  if (!name || name === "" || !maxCapacity) {
    console.error("\nError: Name And MaxCapacity Must Be Filled!");
    return res.status(400).json({
      success: false,
      message: "All Fields Must Be Filled!",
    });
  }
  if (
    !("street" in address) ||
    !("state" in address) ||
    !("city" in address) ||
    !("zip" in address)
  ) {
    console.error("\nError: There Is Missing Property In Address Object!");
    return res.status(400).json({
      success: false,
      message: "There Is Missing Property In Address Object!",
    });
  } else if (
    !address["street"] ||
    address["street"] === "" ||
    !address["state"] ||
    address["state"] === "" ||
    !address["city"] ||
    address["city"] === "" ||
    !address["zip"] ||
    address["zip"] === ""
  ) {
    console.error("\nError: All Fields In Address Object! Must Be Filled!");
    return res.status(400).json({
      success: false,
      message: "All Fields Must Be Filled!",
    });
  }
  if (
    !("email" in contact) ||
    !("owner" in contact) ||
    !("telephone" in contact)
  ) {
    console.error("\nError: There Is Missing Property In Contact Object!");
    return res.status(400).json({
      success: false,
      message: "There Is Missing Property In Contact Object!",
    });
  } else if (
    !contact["email"] ||
    contact["email"] === "" ||
    !contact["owner"] ||
    contact["owner"] === "" ||
    !contact["telephone"] ||
    contact["telephone"] === ""
  ) {
    console.error("\nError: All Fields In Contact Object Must Be Filled!");
    return res.status(400).json({
      success: false,
      message: "All Fields Must Be Filled!",
    });
  }
  try {
    const existingVenue = await Venues.findOne({
      address: address,
      name: name,
    });

    if (existingVenue) {
      return res.status(400).json({
        success: false,
        message: "A Venue With The Same Name And Address Already Exists.",
      });
    }
    const newVenue = new Venues({ name, maxCapacity, address, contact });
    await newVenue.save();

    return res.status(201).json({ success: true, venue: newVenue });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error(
        "\nMongoose Schema Validation Error on Venue Create ==> ",
        error.message
      );
      return res.status(400).json({
        success: false,
        error: `Caught Mongoose Validation Error Backend in Venue Create. Error Message: ${error.message}`,
        message: "All Address Fields Required.",
      });
    }
    console.error(
      "\nCaught Error Backend in Venue Create. Error Message: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
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
    if (error instanceof mongoose.Error.ValidationError) {
      console.error(
        "\nMongoose Schema Validation Error on Venue Edit ==> ",
        error.message
      );
      return res.status(400).json({
        success: false,
        error: `Caught Mongoose Validation Error Backend in Venue Edit. Error Message: ${error.message}`,
        message: "All Address Fields Required.",
      });
    }
    console.error(
      "\nCaught Error Backend in Venue Edit. Error Message: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
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
      console.error("\nError: Unable To Delete Venue.")
      return res
        .status(400)
        .json({ success: false, message: "Failed To Delete Venue." });
    }
    console.log("Success!")
    res.status(201).json({ success: true, venue: deleteVenue, message: "Venue Deleted Successfully!" });
  } catch (error) {
    console.error("\nCaught Error Backend in Venue Delete. Error Message: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

// Get One
router.get("/:venueId/find", async (req, res) => {
  const venueId = req.params.venueId;

  try {
    const findVenue = await Venues.findById(venueId);

    if (!findVenue) {
      console.error("\nError: Venue Not Found.")
      return res
        .status(404)
        .json({ success: false, message: "Venue Not Found." });
    }

    console.log("Success!");
    return res.status(201).json({ success: true, venue: findVenue });
  } catch (error) {
    console.error("\nCaught Error Backend In Venue Find. Error Message: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All
router.get("/findAll", async (req, res) => {
  try {
    const findAllVenues = await Venues.find();

    if (!findAllVenues) {
      console.error("Error: No Venues Were Found!");
      return res
        .status(404)
        .json({ success: false, message: "No Venues Were Found." });
    }
    console.log("Success!")
    return res.status(201).json({ success: true, venues: findAllVenues });
  } catch (error) {
    console.error("\nCaught Error Backend in Venue Find All. Error Message: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

module.exports = router;
