const { Schema, model } = require("mongoose");

const blockSchema = new Schema(
  {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    type: String,
    capacity: Number,
    bprice: Number,
    maxSection: Number,
    maxTables: Number,
    layout: {type: Schema.Types.ObjectId, ref: "Layouts"},
    sections: [{ type: Schema.Types.ObjectId, ref: "Sections" }],
    tables: [{ type: Schema.Types.ObjectId, ref: "Tables" }],
    
  },
  {
    timestamps: true,
  }
);

module.exports = model("Blocks", blockSchema);
