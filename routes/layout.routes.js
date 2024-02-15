var express = require("express");
var router = express.Router();

const Layouts = require("../models/Layouts.model");
const Venues = require("../models/Venues.model");
const Blocks = require("../models/Blocks.model");
const Sections = require("../models/Sections.model");
const Tables = require("../models/Tables.model");

// Create & Assign
router.post("/:venueId/create", async (req, res) => {
  const venueId = req.params.venueId;
  const layoutName = req.body.name;
  if(!layoutName){
    console.error("\nError: Layout Must Have A Name!")
    return res.status(400).json({success: false, message: "Layout Must Have A Name!"})
  }
  try {
    const findVenue = await Venues.findById(venueId);

    if (!findVenue) {
      console.error("\nError: Venue Not Found!");
      return res
        .status(404)
        .json({ success: false, message: "Venue Not Found!" });
    }
    if (findVenue.layouts.length) {
      const findLayouts = await Layouts.find({
        _id: { $in: findVenue.layouts },
      });

      const layoutExist = findLayouts.some(
        (layout) => layout.name === layoutName
      );

      if (layoutExist) {
        console.error(
          `\nError: A Layout With The Name \"${layoutName}\" Already Exists!`
        );
        return res
          .status(400)
          .json({ success: false, message: "Layout Name Taken!" });
      }
    }

    const newLayout = new Layouts(req.body);
    await newLayout.save();

    findVenue.layouts.push(newLayout._id);

    await findVenue.save();

    console.log("Success!");
    return res.status(201).json({
      success: true,
      message: `Layout \"${newLayout.name}\" Created!`,
      layout: newLayout,
    });
  } catch (error) {
    console.error(
      `\nCaught Error Backend in Venue Delete. Error Message: ${error.message}`
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

// Edit
router.put("/:layoutId/edit", async (req, res) => {
  const layoutId = req.params.layoutId;

  try {
    const updatedLayout = await Layouts.findById(layoutId);

    if (!updatedLayout) {
      console.error("\nError: Layout Not Found!");
      return res
        .status(404)
        .json({ success: false, message: "Layout Not Found!" });
    }
    let invalidKey = null;
    for (let key in req.body) {
      if (key in updatedLayout) {
        if (req.body[key] == updatedLayout[key] || !req.body[key]) {
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

    await updatedLayout.save();

    console.log("Success!");

    return res.status(201).json({
      success: true,
      message: "Successfully Updated!",
      layout: updatedLayout,
    });
  } catch (error) {
    console.error(
      "\nCaught Error Backend in Layout Edit. Error Message: ",
      error.message
    );
    res.status(400).json({ success: false, message: "Internal Server Error!" });
  }
});

// Delete & Unassign
router.delete("/:venueId/:layoutId/delete", async (req, res) => {
  const venueId = req.params.venueId;
  const layoutId = req.params.layoutId;

  try {
    const removeLayoutFromVenue = await Venues.findById(venueId);
    const deleteLayout = await Layouts.findById(layoutId);
    if (!removeLayoutFromVenue) {
      console.error("\nError: Venue Not Found!");
      return res
        .status(400)
        .json({ success: false, message: "Venue Not Found!" });
    }

    if (!deleteLayout) {
      console.error("\nError: Layout Not Found!");
      return res
        .status(400)
        .json({ success: false, message: "Layout Not Found!" });
    }

    if (deleteLayout.blocks.length) {
      const blocks = await Blocks.find({ _id: { $in: deleteLayout.blocks } });

      if (!blocks || !blocks.length) {
        console.error("\nError: Unable To Delete Blocks from Layout");
        return res
          .status(400)
          .json({ success: false, message: "Failed To Delete Layout!" });
      }

      for (let block of blocks) {
        if (block.sections.length) {
          const sections = await Sections.find({
            _id: { $in: block.sections },
          });

          if (!sections || !sections.length) {
            console.error(
              "\nError: Unable To Delete Sections from Block from Layout."
            );
            return res
              .status(400)
              .json({ success: false, message: "Failed To Delete Layout!" });
          }

          for (let section of sections) {
            if (section.seats.length) {
              await Seats.deleteMany({ _id: { $in: sections.seats } }).then(
                () => console.log("Deleting Seats From Sections")
              );
            }

            if (section.tables.length) {
              await Tables.deleteMany({ _id: { $in: sections.tables } }).then(
                () => console.log("Deleting Tables From Blocks")
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
      await Blocks.deleteMany({ _id: { $in: layouts.blocks } }).then(() =>
        console.log("Deleting Blocks From Layouts")
      );

      removeLayoutFromVenue.layouts = removeLayoutFromVenue.layouts.filter(
        (id) => id != layoutId
      );
      await removeLayoutFromVenue.save();
      await Layouts.findByIdAndDelete(layoutId);
      console.log("Success!");
      res.status(201).json({
        success: true,
        venue: deleteLayout,
        message: "Layout Deleted Successfully!",
      });
    }
  } catch (error) {
    console.error(
      "\nCaught Error Backend in Layout Delete. Error Message: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }

  // console.log("Im deleting");

  // try {
  //   const venue = await Venues.findById(venueId);
  //   if (!venue) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Venue not found." });
  //   }

  //   if (!venue.layouts.includes(layoutId)) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Layout not found." });
  //   }

  //   venue.layouts = venue.layouts.filter((id) => id.toString() !== layoutId);
  //   await venue.save();

  //   const layout = await Layouts.findById(layoutId);
  //   if (!layout) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Layout not found." });
  //   }

  //   await Layouts.findByIdAndDelete(layoutId);

  //   return res.status(201).json({ success: true, message: "Layout removed." });
  // } catch (error) {
  //   res.status(400).json({ success: false, message: error.message });
  // }
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
      console.error("Error: Venue Not Found!");
      return res
        .status(404)
        .json({ success: false, message: "Venue not found." });
    }
    console.log("Success!");
    return res.status(201).json({
      success: true,
      message: `Layouts Found: ${findVenue.layouts.length}`,
      layouts: findVenue.layouts,
    });
  } catch (error) {
    console.error(
      "\nCaught Error Backend in Layouts Find All. Error Message:",
      error.massage
    );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
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
