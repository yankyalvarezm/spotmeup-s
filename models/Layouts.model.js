const { Schema, model } = require("mongoose");

const layoutSchema = new Schema(
  {
    name: String,
    width: { type: Number, default: 800 },
    maxWidth: {type: Number, default: 1200},
    height: { type: Number, default: 400 },
    maxHeight: {type: Number, default: 1600},
    borderSize: { type: Number, default: 7 },
    borderRadius: { type: Number, default: 0 },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    status: String,
    layoutType: String,
    capacity: Number,
    venue: {type:Schema.Types.ObjectId, ref: "Venues"},
    blocks: [{ type: Schema.Types.ObjectId, ref: "Blocks" }],
    shapes: [{type: Schema.Types.ObjectId, ref: "Shapes"}]
  },
  {
    timestamps: true,
  }
);

module.exports = model("Layouts", layoutSchema);
