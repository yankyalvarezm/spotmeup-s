const { Schema, model } = require("mongoose");

const shapeModel = new Schema(
  {
    shapeType: String,
    name: String,
    width: Number,
    height: Number,
    border: String,
    borderRadius: Number,
    borderLeft: Number,
    borderRight: Number,
    borderTop: Number,
    borderBottom: Number,
    backgroundColor: String,
    x: Number,
    y: Number,
    layout: {type: Schema.Types.ObjectId, ref:"Layouts"}
  },
  {
    timestamps: true,
  }
);

module.exports = model("Shapes", shapeModel);
