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
          blockId
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
// router.post("/:blockId/manual/create", async (req, res) => {
//   const blockId = req.params.blockId;
//   const { number, ...tableData } = req.body;

//   try {
//     const block = await Blocks.findById(blockId).populate("tables");

//     if (!block) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Block not found" });
//     }

//     const maxTableNum = block.maxTables;

//     if (number > maxTableNum) {
//       return res.status(404).json({
//         success: false,
//         message: "Max table limit exceeded",
//       });
//     }

//     if (block.tables.length) {
//       const tableExist = block.tables.some((table) => table.number === number);
//       if (tableExist) {
//         return res.status(404).json({
//           success: false,
//           message: "A Table with this number already exist.",
//         });
//       }
//     }

//     const newTable = new Tables({ ...tableData, number });
//     await newTable.save();

//     block.tables.push(newTable);
//     await block.save();

//     return res.status(201).json({ success: true, table: newTable });
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(400).json({ success: false, message: error.message });
//   }
// });

router.post("/b/:blockId/create", async (req, res) => {
  const {blockId} = req.params
  const {number} = req.body;
  try {
    const block = await Blocks.findById(blockId).populate("tables")
    if(!block){
      console.error("\nError: Block Not Found!")
      return res.status(404).json({success: false, message: "Block Not Found!"})
    }
    if(block.tables.length === block.maxTables){
      console.error("\nError: Table Limit Reached!")
      return res.status(400).json({success:false, message:"Table Limit Reached!"})
    }
    if(number > block.maxTables){
      console.error("\nError: Table Number Exceed Limit!")
      return res.status(400).json({success:false, message:"Table Number Exceed Limit!"})
    }
    const tableExist = block.tables.some(table => number === table.number)
    if(tableExist){
      console.error("Error: A Table With This Number Exists")
      return res.status(400).json({success:false, message:"A Table With This Number Exists"})
    }
    const newTable = new Tables({...req.body, block: blockId});
    block.tables.push(newTable._id);
    await block.save();
    await newTable.save();
    console.log("Success!")
    return res.status(201).json({success: true, message:"OK", table: newTable})
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message:  "Internal Server Error" });
  }
})

// Edit
router.put("/:tableId/edit", async (req, res) => {
  const {tableId } = req.params;
  const { number } = req.body;

  try {
    const table = await Tables.findById(tableId);
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Table not found" });
    }
    const block = await Blocks.findById(table.block).populate("tables");

    if (!block) {
      return res
        .status(404)
        .json({ success: false, message: "Block not found" });
    }


    if (number !== table.number) {
      const tableExist = block.tables.some((table) => table.number === number);
      // console.log("Line 128 - Table Exist:", tableExist);

      if (tableExist) {
        return res.status(404).json({
          success: false,
          message: "Table number taken.",
        });
      }
    }
    for (let key in req.body) {
      if (key in table) { 
          table[key] = req.body[key];
      }
    }
    table.save();
    // const updatedTable = await Tables.findByIdAndUpdate(tableId, {
    //   number,
    //   ...tableData,
    // });

    // if (!updatedTable) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Table not updated." });
    // }

    return res.status(200).json({ success: true, table });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete & Unassign
// router.delete("/:tableId/delete", async (req, res) => {
//   const blockId = req.params.blockId;
//   const tableId = req.params.tableId;

//   try {
//     const block = await Blocks.findById(blockId);
//     if (!block) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Block not found." });
//     }

//     if (!block.tables.includes(tableId)) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Table not found in Block." });
//     }

//     block.tables = block.tables.filter((id) => id.toHexString() !== tableId);
//     await block.save();

//     const table = await Tables.findById(tableId);

//     if (!table) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Seats not found." });
//     }

//     await Tables.findByIdAndDelete(tableId);

//     return res.status(201).json({ success: true, message: "Table removed." });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// });

router.delete("/:tableId/delete", async (req, res) => {
  const {tableId} = req.params
  try {
    const table = await Tables.findById(tableId);
    if(!table){
      console.error("\nError: Table Not Found!")
      return res.status(404).json({success:false,message:"Table Not Found!"})
    }

    await table.deleteOne();
    return res.status(200).json({success: true, message:"OK"})
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
})

// Get One
router.get("/:tableId/find", async (req, res) => {
  const tableId = req.params.tableId;

    try {
        const findTable = await Tables.findById(tableId)

        if(!findTable){
            return res
        .status(404)
        .json({ success: false, message: "Table not found." });
        }

        return res.status(201).json({ success: true, table: findTable });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

});

// Get All tables from one Block
router.get("/:blockId/findAll", async (req, res) => {
    const blockId = req.params.blockId;
  
    try {
      const findBlockTables = await Blocks.findById(blockId).populate(
        "tables"
      );
      if (!findBlockTables) {
        return res
          .status(404)
          .json({ success: false, message: "tables not found." });
      }
  
      console.log("Found tables:", findBlockTables.tables);
  
      return res
        .status(201)
        .json({ success: true, tables: findBlockTables.tables });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

module.exports = router;
