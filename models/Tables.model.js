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
    Number: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Tables", tableSchema);
