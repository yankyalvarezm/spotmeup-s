var express = require("express");

const Transactions = require("../models/Transaction.model.js");
var router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated.js");

router.post("/create", async (req, res) => {
  try {
    const transaction = new Transactions(req.body);
    await transaction.save();
    return res
      .status(201)
      .json({ success: true, message: "Transaction Created!" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

router.get("/:transactionId/find", async (req, res) => {
  try {
    const transaction = await Transactions.findById(req.params.transactionId);
    if (!transaction) {
      return res
        .status(400)
        .json({ success: true, message: "Transaction Not Found!" });
    }
    return res.status(200).json({ success: true, message: "OK!", transaction });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
router.get("/findAll", async (req, res) => {
  try {
    const transactions = await Transactions.find();
    if (!transactions.length) {
      return res
        .status(200)
        .json({ success: true, message: "No Transactions Found!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "OK!", transactions });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});
router.get("/user/findAll", isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transactions.find({buyer: req.user});
    if (!transactions.length) {
      return res
        .status(200)
        .json({ success: true, message: "No Transactions Found!" });
    }
    return res
      .status(200)
      .json({ success: true, message: "OK!", transactions });
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
});

module.exports = router;

// Delete Missing
// Edit Missing