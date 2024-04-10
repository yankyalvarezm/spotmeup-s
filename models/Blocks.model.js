const { Schema, model } = require("mongoose");

const blockSchema = new Schema(
  {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    blockType: String,
    capacity: Number,
    bprice: Number,
    maxSection: Number,
    maxTables: Number,
    sections: [{ type: Schema.Types.ObjectId, ref: "Sections" }],
    tables: [{ type: Schema.Types.ObjectId, ref: "Tables" }],
    
  },
  {
    timestamps: true,
  }
);

module.exports = model("Blocks", blockSchema);
