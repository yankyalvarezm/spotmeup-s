const { Schema, model } = require("mongoose");

const seatSchema = new Schema(
  {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    cprice: Number,
    row: Number,
    column: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Seats", seatSchema);
