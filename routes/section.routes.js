var express = require("express");
var router = express.Router();

const Sections = require("../models/Sections.model");
const Blocks = require("../models/Blocks.model");

// Create & Assign
router.post("/:blockId/create", async (req, res) => {
  const blockId = req.params.blockId;
  const sectionName = req.body.name;

  try {
    const existingSection = await Blocks.findById(blockId).populate("sections");

    if (!existingSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section doesn't exist" });
    }

    const sectionExist = existingSection.sections.some(
      (section) => section.name === sectionName
    );

    if (sectionExist) {
      return res
        .status(400)
        .json({ success: false, message: "Section name taken." });
    }

    const newSection = new Sections({...req.body,blockId});
    await newSection.save();

    const updatedBlock = await Blocks.findByIdAndUpdate(
      blockId,
      { $addToSet: { sections: newSection._id } },
      { new: true }
    ).populate("sections");

    if (!updatedBlock) {
      return res.status(404).json({
        success: false,
        message: "Block not found or unable to update block",
      });
    }

    return res.status(201).json({ success: true, block: updatedBlock });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Edit
router.put("/:sectionId/edit", async (req, res) => {
  const sectionId = req.params.sectionId;

  try {
    const updatedSection = await Sections.findByIdAndUpdate(sectionId, req.body, {
      new: true,
    });

    if (!updatedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found." });
    }

    return res.status(201).json({ success: true, section: updatedSection });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete & Unassign
router.delete("/:blockId/:sectionId/delete", async (req, res) => {
  const blockId = req.params.blockId;
  const sectionId = req.params.sectionId;

  try {
    const block = await Blocks.findById(blockId);
    if (!block) {
      return res
        .status(404)
        .json({ success: false, message: "Block not found." });
    }

    if (!block.sections.includes(sectionId)) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found in Block." });
    }

    block.sections = block.sections.filter((id) => id.toString() !== sectionId);
    await block.save();

    const section = await Sections.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found." });
    }

    await Sections.findByIdAndDelete(sectionId);

    return res.status(201).json({ success: true, message: "Section removed." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get One
router.get("/:sectionId/find", async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
      const findSection = await Sections.findById(sectionId);
      if (!findSection) {
        return res
          .status(404)
          .json({ success: false, message: "Section not found." });
      }
      return res.status(201).json({ success: true, block: findSection });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });
  
  // Get All Sections from one block
  router.get('/:blockId/findAll', async (req,res) =>{
      const blockId = req.params.blockId;
      try {
          const findBlockSections = await Blocks.findById(blockId).populate("sections")
          if(!findBlockSections){
              return res
                      .status(404)
                      .json({ success: false, message: "Sections not found." });
          }
          return res.status(201).json({ success: true, sections: findBlockSections.sections })
      } catch (error) {
          res.status(400).json({ success: false, message: error.message });
      }
  })

module.exports = router;
