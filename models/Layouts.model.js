const { Schema, model } = require("mongoose");

const layoutSchema = new Schema(
  {
    name: String,
    width: { type: Number, default: 400 },
    maxWidth: {type: Number, default: 450},
    height: { type: Number, default: 400 },
    maxHeight: {type: Number, default: 600},
    borderSize: { type: Number, default: 2 },
    borderRadius: { type: Number, default: 2 },
    status: String,
    capacity: Number,
    blocks: [{ type: Schema.Types.ObjectId, ref: "Blocks" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Layouts", layoutSchema);
