const { Schema, model } = require("mongoose");
const layoutSchema = new Schema(
  {
    name: String,
    width: { type: Number, default: 800 },
    maxWidth: { type: Number, default: 1200 },
    height: { type: Number, default: 400 },
    maxHeight: { type: Number, default: 1600 },
    borderSize: { type: Number, default: 7 },
    borderRadius: { type: Number, default: 0 },
    displayScale: { type: Number, default: 1 },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    status: String,
    layoutType: String,
    capacity: Number,
    venue: { type: Schema.Types.ObjectId, ref: "Venues" },
    blocks: [{ type: Schema.Types.ObjectId, ref: "Blocks" }],
    shapes: [{ type: Schema.Types.ObjectId, ref: "Shapes" }],
  },
  {
    timestamps: true,
  }
);

layoutSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // 'this' is the layout being removed. Pass it to the next middleware.
    const Blocks = model("Blocks");
    const Shapes = model("Shapes");
    const Venues = model("Venues");
    try {
      const venue = await Venues.findById(this.venue);
      if (venue) {
        venue.layouts = venue.layouts.filter(
          (layoutId) => layoutId.toString() != this._id.toString()
        );
        await venue.save();
        const [blocks] = await Promise.all([Blocks.find({ layout: this._id })]);
        console.log("Deleting blocks and shapes from layout");
        await Promise.all([...blocks].map((doc) => doc.deleteOne().exec()));
        await Shapes.deleteMany({ layout: this._id });
      } else {
        console.error("venue Not Found!");
      }
      next();
    } catch (error) {
      console.error("Cascade Delete Error On Layouts Model");
      throw error;
    }
  }
);

module.exports = model("Layouts", layoutSchema);
