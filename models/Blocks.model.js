const { Schema, model } = require("mongoose");

const blockSchema = new Schema(
  {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    capacity: Number,
    bprice: Number,
    maxSection: Number,
    sections: [{ type: Schema.Types.ObjectId, ref: "Sections" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Blocks", blockSchema);
