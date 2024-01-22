var express = require("express");
var router = express.Router();

const Blocks = require("../models/Blocks.model");
const Tables = require("../models/Tables.model");

// Create & Assign - Automatic
router.post("/:blockId/automatic/create", async (req, res) => {
  const blockId = req.params.blockId;

  try {
    const block = await Blocks.findById(blockId).populate("tables");

    if (!block) {
      return res
        .status(404)
        .json({ success: false, message: "Block doesn't exist" });
    }

    const maxTables = block.maxTables;
    let createdTables = [];

    for (let i = 1; i <= maxTables; i++) {
      const tableExist = block.tables.some((table) => table.number === i);
      console.log("Table Exist:", tableExist);
      if (!tableExist) {
        const newTables = new Tables({
          x: 0,
          y: 0,
          width: 80,
          heigth: 80,
          status: "Available",
          cprice: 0,
          tickets: 0,
          isIncluded: false,
          number: i,
        });

        console.log("New Tables:", newTables);
        await newTables.save();
        createdTables.push(newTables);
      }
    }

    if (createdTables.length > 0) {
      block.tables.push(...createdTables.map((table) => table._id));
      await block.save();
    }

    return res.status(201).json({ success: true, newTables: createdTables });
  } catch (error) {
    console.log("Errorrr");
    res.status(400).json({ success: false, message: error.message });
  }
});

// Create & Assign - Manual
router.post("/:blockId/manual/create", async (req, res) => {
  const blockId = req.params.blockId;
  const { number, ...tableData } = req.body;

  try {
    const block = await Blocks.findById(blockId).populate("tables");

    if (!block) {
      return res
        .status(404)
        .json({ success: false, message: "Block not found" });
    }

    const maxTableNum = block.maxTables;

    if (number > maxTableNum) {
      return res.status(404).json({
        success: false,
        message: "Max table limit exceeded",
      });
    }

    if (block.tables.length) {
      const tableExist = block.tables.some((table) => table.number === number);
      if (tableExist) {
        return res.status(404).json({
          success: false,
          message: "A Table with this number already exist.",
        });
      }
    }

    const newTable = new Tables({ ...tableData, number });
    await newTable.save();

    block.tables.push(newTable);
    await block.save();

    return res.status(201).json({ success: true, block: block.tables });
  } catch (error) {
    console.log("Errorrr");
    res.status(400).json({ success: false, message: error.message });
  }
});

// Edit

// Delete & Unassign

// Get One

// Get All Seats from one Block

module.exports = router;
