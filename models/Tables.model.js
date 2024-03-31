const { Schema, model } = require("mongoose");

const tableSchema = new Schema(
  {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    cprice: Number,
    tickets: Number,
    isIncluded: Boolean,
    number: Number,
    layout:{ type: Schema.Types.ObjectId, ref: "Layouts" },
    block: { type: Schema.Types.ObjectId, ref: "Blocks" },
    section:{ type: Schema.Types.ObjectId, ref: "Sections" }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Tables", tableSchema);
