const { Schema, model } = require("mongoose");

const seatSchema = new Schema(
  {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    cprice: Number,
    row: String,
    column: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Seats", seatSchema);
