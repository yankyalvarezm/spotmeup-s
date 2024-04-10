var express = require("express");
var router = express.Router();

const Blocks = require("../models/Blocks.model");
const Layouts = require("../models/Layouts.model");

// Create & Assign
router.post("/:layoutId/create", async (req, res) => {
  const layoutId = req.params.layoutId;
  const blockName = req.body.name;

  try {
    // const existingBlock = await Layouts.findById(layoutId).populate("blocks");
    const existingBlock = await Layouts.findById(layoutId).populate("blocks");

    if (!existingBlock) {
      return res
        .status(404)
        .json({ success: false, message: "Layout Not Found!" });
    }

    const blockExist = existingBlock.blocks.some(
      (block) => block.name === blockName
    );

    if (blockExist) {
      return res
        .status(400)
        .json({ success: false, message: "Block Name Taken." });
    }

    const newBlock = new Blocks(req.body);
    await newBlock.save();

    const updatedLayout = await Layouts.findByIdAndUpdate(
      layoutId,
      { $addToSet: { blocks: newBlock._id } },
      { new: true }
    ).populate("blocks");

    if (!updatedLayout) {
      return res.status(404).json({
        success: false,
        message: "Layout not found or unable to update layout",
      });
    }

    return res.status(201).json({ success: true, block: newBlock });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// Edit
router.put("/:blockId/edit", async (req, res) => {
  const blockId = req.params.blockId;

  try {
    const updatedBlock = await Blocks.findByIdAndUpdate(blockId, req.body, {
      new: true,
    });

    if (!updatedBlock) {
      return res
        .status(404)
        .json({ success: false, message: "Block not found." });
    }

    return res.status(201).json({ success: true, block: updatedBlock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete & Unassign
router.delete("/:layoutId/:blockId/delete", async (req, res) => {
  const layoutId = req.params.layoutId;
  const blockId = req.params.blockId;

  try {
    const layout = await Layouts.findById(layoutId);
    if (!layout) {
      return res
        .status(404)
        .json({ success: false, message: "Layout not found." });
    }

    if (!layout.blocks.includes(blockId)) {
      return res
        .status(404)
        .json({ success: false, message: "Block not found." });
    }

    layout.blocks = layout.blocks.filter((id) => id.toString() !== blockId);
    await layout.save();

    const block = await Blocks.findById(blockId);
    if (!block) {
      return res
        .status(404)
        .json({ success: false, message: "Block not found." });
    }

    await Blocks.findByIdAndDelete(blockId);

    return res.status(201).json({ success: true, message: "Block removed." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get One
router.get("/:blockId/find", async (req, res) => {
    const blockId = req.params.blockId;
    try {
      const findBlock = await Blocks.findById(blockId);
      if (!findBlock) {
        return res
          .status(404)
          .json({ success: false, message: "Layout not found." });
      }
      return res.status(201).json({ success: true, layout: findBlock });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  // Get All Blocks from one layout
  router.get('/:layoutId/findAll', async (req,res) =>{
      const layoutId = req.params.layoutId;
      try {
          const findLayoutBlocks = await Layouts.findById(layoutId).populate("blocks")
          if(!findLayoutBlocks){
              return res
                      .status(404)
                      .json({ success: false, message: "Blocks not found." });
          }
          return res.status(201).json({ success: true, blocks: findLayoutBlocks.blocks })
      } catch (error) {
          res.status(400).json({ success: false, message: error.message });
      }
  })

module.exports = router;
