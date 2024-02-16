var express = require("express");
var router = express.Router();

const Venues = require("../models/Venues.model");
const Layouts = require("../models/Layouts.model");
const Blocks = require("../models/Blocks.model");
const Sections = require("../models/Sections.model");
const Tables = require("../models/Tables.model");
const Seats = require("../models/Seats.model");
const { default: mongoose } = require("mongoose");

// Create Venue
router.post("/create", async (req, res) => {
  const { name, maxCapacity, address, contact, description } = req.body;

  if (!name) {
    console.error("\nError: Name Must Be Filled!");
    return res.status(400).json({
      success: false,
      message: "Name Must Be Filled!",
    });
  } else if (!description) {
    console.error(`\nError: Description Must Not Be Empty!`);
    return res.status(400).json({
      success: false,
      message: `Description Must Not Be Null!`,
    });
  } else if (!maxCapacity) {
    console.error(`\nError: Max Capacity Cannot Be ${maxCapacity}!`);
    return res.status(400).json({
      success: false,
      message: `Max Capacity Cannot Be ${maxCapacity}!`,
    });
  } else if (!address) {
    console.error(`\nError: Address Must Not Be Null!`);
    return res.status(400).json({
      success: false,
      message: `Address Must Not Be Null!`,
    });
  } else if (!contact) {
    console.error(`\nError: Contact Must Not Be Null!`);
    return res.status(400).json({
      success: false,
      message: `Contact Must Not Be Null!`,
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
    !address["state"] ||
    !address["city"] ||
    !address["zip"]
  ) {
    console.error("\nError: All Fields In Address Object! Must Be Filled!");
    return res.status(400).json({
      success: false,
      message: "All Fields In Address Must Be Filled!",
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
  } else if (!contact["email"] || !contact["owner"] || !contact["telephone"]) {
    console.error("\nError: All Fields In Contact Object Must Be Filled!");
    return res.status(400).json({
      success: false,
      message: "All Fields In Contact Must Be Filled!",
    });
  }
  try {
    const existingVenue = await Venues.findOne({
      address: address,
      name: name,
    });

    if (existingVenue) {
      console.error(
        "\nError: A Venue With The Same Name And Address Already Exists!"
      );
      return res.status(400).json({
        success: false,
        message: "A Venue With The Same Name And Address Already Exists!",
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
    const updatedVenue = await Venues.findById(venueId);

    if (!updatedVenue) {
      console.error("\nError: Venue not found.");
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }
    let invalidKey = null;
    for (let key in req.body) {
      if (key in updatedVenue) {
        if (req.body[key] == updatedVenue[key] || !req.body[key]) {
          continue;
        } else {
          updatedVenue[key] = req.body[key];
        }
      } else {
        invalidKey = key;
        break;
      }
    }
    if (invalidKey) {
      console.error(`Error: Property ${invalidKey} not part of Venue Schema.`);
      return res.status(500).json({
        success: false,
        message: `Venue Details Failed To Be Updated!`,
      });
    }
    await updatedVenue.save();
    console.log("Success!");
    return res.status(201).json({
      success: true,
      message: "Successfully Updated!",
      venue: updatedVenue,
    });
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
    const deleteVenue = await Venues.findById(venueId);

    if (!deleteVenue) {
      console.error("\nError: Unable To Delete Venue.");
      return res
        .status(400)
        .json({ success: false, message: "Failed To Delete Venue." });
    }
    if (deleteVenue.layouts.length) {
      const layouts = await Layouts.find({ _id: { $in: deleteVenue.layouts } });
      if (!layouts || !layouts.length) {
        console.error("\nError: Unable To Delete Layouts In Venue.");
        return res
        .status(400)
        .json({ success: false, message: "Failed To Delete Venue." });
      }
      // console.log(layouts);
      for(let layout of layouts){
        if (layout.blocks.length) {
          const blocks = await Blocks.find({ _id: { $in: layout.blocks } });
          if (!blocks || !blocks.length) {
            console.error("\nError: Unable To Delete Blocks from Layout In Venue.");
            return res
              .status(400)
              .json({ success: false, message: "Failed To Delete Venue." });
          }
          for(let block of blocks){

            if (block.sections.length) {
              const sections = await Sections.find({
                _id: { $in: block.sections },
              });
              if (!sections || !sections.length) {
                console.error("\nError: Unable To Delete Sections from Block from Layout In Venue.");
                return res
                  .status(400)
                  .json({ success: false, message: "Failed To Delete Venue." });
              }
              for(let section of sections){
                if (section.seats.length) {
                  await Seats.deleteMany({ _id: { $in: section.seats } }).then(() =>
                    console.log("Deleting Seats From Sections")
                  );
                }
                if (section.tables.length) {
                  await Tables.deleteMany({ _id: { $in: section.tables } }).then(() =>
                    console.log("Deleting Tables From Blocks")
                  );
                }
              }
              await Sections.deleteMany({ _id: { $in: block.sections } }).then(() =>
                console.log("Deleting Sections From Blocks")
              );
            }
            if (block.tables.length) {
              await Tables.deleteMany({ _id: { $in: block.tables } }).then(() =>
                console.log("Deleting Tables From Blocks")
              );
            }
          }
          await Blocks.deleteMany({ _id: { $in: layout.blocks } }).then(() =>
            console.log("Deleting Blocks From Layouts")
          );
        }
      }
      await Layouts.deleteMany({ _id: { $in: deleteVenue.layouts } }).then(() =>
        console.log("Deleting Layouts From Venues")
      );
    }
    await Venues.findByIdAndDelete(venueId);
    console.log("Success!");
    res.status(201).json({
      success: true,
      venue: deleteVenue,
      message: "Venue Deleted Successfully!",
    });
  } catch (error) {
    console.error(
      "\nCaught Error Backend in Venue Delete. Error Message: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

// Get One
router.get("/:venueId/find", async (req, res) => {
  const venueId = req.params.venueId;

  try {
    const findVenue = await Venues.findById(venueId);

    if (!findVenue) {
      console.error("\nError: Venue Not Found.");
      return res
        .status(404)
        .json({ success: false, message: "Venue Not Found." });
    }
    console.log("Success!");
    return res.status(201).json({ success: true, venue: findVenue });
  } catch (error) {
    console.error(
      "\nCaught Error Backend In Venue Find. Error Message: ",
      error.message
    );
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
    console.log("Success!");
    return res.status(201).json({ success: true, venues: findAllVenues });
  } catch (error) {
    console.error(
      "\nCaught Error Backend in Venue Find All. Error Message: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

module.exports = router;
