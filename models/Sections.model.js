const { Schema, model } = require("mongoose");
const Seats = require("./Seats.model");
const Tables= require("./Tables.model");

const sectionSchema = new Schema(
  {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    capacity: Number,
    sprice: Number,
    tickets: Number,
    maxCol: Number,
    maxRow: {
      type: String,
      enum: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
    },
    block:{ type: Schema.Types.ObjectId, ref: "Blocks" },
    seats: [{ type: Schema.Types.ObjectId, ref: "Seats" }],
    tables: [{ type: Schema.Types.ObjectId, ref: "Tables" }],
  },
  {
    timestamps: true,
  }
);

sectionSchema.pre('deleteOne', {document:true, query:false},async function (next) {
  try {
    const [seats, tables] = await Promise.all([Seats.find({section:this._id}), Tables.find({section:this._id})])
    console.log("Deleting seats and tables from section");
    await Promise.all([...seats, ...tables].map((doc) => doc.deleteOne().exec()))
    next()
  } catch (error) {
    console.error("Cascade Delete Error On Sections Model");
    throw error;
  }
})


module.exports = model("Sections", sectionSchema);
