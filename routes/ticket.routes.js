var express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated.js");
const Tickets = require("../models/Tickets.model");
const Events = require("../models/Events.model");
const Layouts = require("../models/Layouts.model");
const Blocks = require("../models/Blocks.model");
var router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const event = await Events.findById(req.body.event);
    if (!event) {
      console.log("Invalid Event Id!");
      return res
        .status(400)
        .json({ success: false, message: "Invalid Event Id!" });
    }
    const layout = await Layouts.findById(req.body.layout);
    if (!layout) {
      console.log("Invalid Layout Id!");
      return res
        .status(400)
        .json({ success: false, message: "Invalid Layout Id!" });
    }
    const block = await Blocks.findById(req.body.layout);
    if (!block) {
      console.log("Invalid Block Id!");
      return res
        .status(400)
        .json({ success: false, message: "Invalid Block Id!" });
    }
    const ticket = new Tickets({ ...req.body });
    await ticket.save();
    await ticket.populate("event", "layout", "block");
    const mailOptions = {
      from: process.env.EMAIL_AUTH_USER,
      to: req.body.email,
      subject: "Thank You For Your Purchase",
      text: "Thank You For Your Purchase",
    };
    return res
      .status(201)
      .json({ success: true, message: "Ticket Created Successfully!", ticket });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
router.put("/:ticketId/edit", async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.eventId).populate(
      "buyer",
      "event"
    );
    if (!ticket) {
      return res
        .status(400)
        .json({ success: true, message: "Ticket not found!" });
    }
    for (key in req.body) {
      if (
        req.body[key] === ticket[key] ||
        key === "event" ||
        key === "buyer" ||
        key === "layout" ||
        key === "block"
      ) {
        continue;
      } else {
        ticket[key] = req.body[key];
      }
    }
    await ticket.save();
    return res
      .status(200)
      .json({ success: true, message: "Ticket Edited!", ticket });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
router.get("/:ticketId/find", async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.eventId).populate(
      "buyer",
      "event",
      "layout",
      "block"
    );
    if (!ticket) {
      return res
        .status(400)
        .json({ success: true, message: "Ticket not found!" });
    }
    return res.status(200).json({ success: true, message: "OK!", ticket });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
//maybe create a find tickets by eventId and/or by userId

router.get("/user/findAll", isAuthenticated, async (req, res) => {
  try {
    const tickets = await Tickets.find({ buyer: req.user._id }).populate(
      "buyer",
      "event",
      "layout",
      "block"
    );
    if (!tickets.length) {
      return res
        .status(200)
        .json({ success: true, message: `No ticket found!` });
    }
    return res.status(200).json({
      success: true,
      message: `Found ${tickets.length} tickets`,
      tickets,
    });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
router.get("/findAll", async (req, res) => {
  try {
    const tickets = await Tickets.find().populate("buyer", "event");
    if (!tickets.length) {
      return res
        .status(200)
        .json({ success: true, message: `No ticket found!` });
    }
    return res.status(200).json({
      success: true,
      message: `Found ${tickets.length} tickets`,
      tickets,
    });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
router.delete("/:ticketId/delete", async (req, res) => {
  try {
    const ticket = await Tickets.findById(req.params.eventId);
    if (!ticket) {
      res.status(400).json({ success: true, message: "Ticket not found!" });
    }
    await ticket.deleteOne();
    return res.status(200).json({ success: true, message: "Ticket Deleted!" });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

module.exports = router;
