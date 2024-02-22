const { Schema, model } = require("mongoose");

const shapeModel = new Schema(
  {
    shapeType: String,
    name: String,
    width: {type: Number, default: 100},
    height: {type: Number, default: 100},
    border: String,
    borderRadius: Number,
    borderLeft: Number,
    borderRight: Number,
    borderTop: Number,
    borderBottom: Number,
    borderSize: {type:Number, default: 1},
    color: {type: String, default: "white"},
    backgroundColor: {type: String, default: "black"},
    x: Number,
    y: Number,
    layout: {type: Schema.Types.ObjectId, ref:"Layouts"}
  },
  {
    timestamps: true,
  }
);

module.exports = model("Shapes", shapeModel);
