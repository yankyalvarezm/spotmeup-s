const { Schema, model } = require("mongoose");

const layoutSchema = new Schema(
  {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    capacity: Number,
    blocks: [{ type: Schema.Types.ObjectId, ref: "Blocks" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Layouts", layoutSchema);