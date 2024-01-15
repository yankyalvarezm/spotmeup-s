const { Schema, model } = require("mongoose");

const sectionSchema = new Schema(
  {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    capacity: Number,
    sprice: Number,
    tickets: Number,
    seats: [{ type: Schema.Types.ObjectId, ref: "Seats" }],
    tables: [{ type: Schema.Types.ObjectId, ref: "Tables" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Sections", sectionSchema);
