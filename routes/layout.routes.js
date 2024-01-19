var express = require("express");
var router = express.Router();

const Layouts = require("../models/Layouts.model");
const Venues = require("../models/Venues.model");

// Create & Assign
router.post("/:venueId/create", async (req, res) => {
  const venueId = req.params.venueId;
  const layoutName = req.body.name;

  try {
    const existingLayout = await Venues.findById(venueId).populate("layouts");

    if (!existingLayout) {
      return res
        .status(404)
        .json({ success: false, message: "Layout doesn't exist" });
    }

    const layoutExist = existingLayout.layouts.some(
      (layout) => layout.name === layoutName
    );

    if (layoutExist) {
      return res
        .status(400)
        .json({ success: false, message: "Layout name taken." });
    }

    const newLayout = new Layouts(req.body);
    await newLayout.save();

    const updatedVenue = await Venues.findByIdAndUpdate(
      venueId,
      { $addToSet: { layouts: newLayout._id } },
      { new: true }
    ).populate("layouts");

    if (!updatedVenue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found or unable to update venue",
      });
    }

    return res.status(201).json({ success: true, venue: updatedVenue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Edit
router.put("/:layoutId/edit", async (req, res) => {
  const layoutId = req.params.layoutId;

  try {
    const updatedLayout = await Layouts.findByIdAndUpdate(layoutId, req.body, {
      new: true,
    });

    if (!updatedLayout) {
      return res
        .status(404)
        .json({ success: false, message: "Layout not found." });
    }

    return res.status(201).json({ success: true, layout: updatedLayout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete & Unassign
router.delete("/:venueId/:layoutId/delete", async (req, res) => {
  const venueId = req.params.venueId;
  const layoutId = req.params.layoutId;

  console.log("Im deleting");

  try {
    const venue = await Venues.findById(venueId);
    if (!venue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }

    if (!venue.layouts.includes(layoutId)) {
      return res
        .status(404)
        .json({ success: false, message: "Layout not found." });
    }

    venue.layouts = venue.layouts.filter((id) => id.toString() !== layoutId);
    await venue.save();

    const layout = await Layouts.findById(layoutId);
    if (!layout) {
      return res
        .status(404)
        .json({ success: false, message: "Layout not found." });
    }

    await Layouts.findByIdAndDelete(layoutId);

    return res.status(201).json({ success: true, message: "Layout removed." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get One
router.get("/:layoutId/find", async (req, res) => {
  const layoutId = req.params.layoutId;
  try {
    const findLayout = await Layouts.findById(layoutId);
    if (!findLayout) {
      return res
        .status(404)
        .json({ success: false, message: "Layout not found." });
    }
    return res.status(201).json({ success: true, layout: findLayout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get All Layouts from one venue
router.get("/:venueId/findAll", async (req, res) => {
  const venueId = req.params.venueId;
  try {
    const findVenue = await Venues.findById(venueId).populate("layouts");
    if (!findVenue) {
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }
    return res.status(201).json({ success: true, layouts: findVenue.layouts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// router.get("/:layoutName/findbyname", async (req, res) => {
//   const layoutName = req.params.layoutId;
//   try {
//     const findLayout = await Layouts.findOne({name:layoutName});
//     if (!findLayout) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Layout not found." });
//     }
//     return res.status(201).json({ success: true, layout: findLayout });
// } catch (error) {
//     res.status(400).json({ success: false, message: error });
//   }
// });

// Get All
// router.get("/findAll", async (req, res) => {
//   try {
//     const findAllLayouts = await Layouts.find();
//     if (!findAllLayouts) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Layouts not found." });
//     }
//     return res.status(201).json({ success: true, layouts: findAllLayouts });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error });
//   }
// });

module.exports = router;
