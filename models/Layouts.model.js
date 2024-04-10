const { Schema, model } = require("mongoose");
const Blocks = require("./Blocks.model");
const Shapes = require("./Shapes.model");

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

layoutSchema.pre('deleteOne', {document:true, query:false},async function(next) {
  // 'this' is the layout being removed. Pass it to the next middleware.
  try {
    const [blocks, shapes] = await Promise.all([Blocks.find({layout:this._id}), Shapes.find({layout:this._id})])
    console.log("Deleting blocks and shapes from layout");
    await Promise.all([...blocks, ...shapes].map(doc => {console.log("Deleting"); doc.deleteOne()}))
    next();
  } catch (error) {
    console.error("Cascade Delete Error On Layouts Model");
    throw error;
  }


});

module.exports = model("Layouts", layoutSchema);
