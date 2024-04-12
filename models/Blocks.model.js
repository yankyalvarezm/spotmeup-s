const { Schema, model } = require("mongoose");
const Sections = require("./Sections.model");
const Tables = require("./Tables.model");

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

blockSchema.pre('deleteOne', {document:true, query:false}, async function(next) {
  try {
    const [sections, tables] = await Promise.all([Sections.find({block:this._id}), Tables.find({block:this._id})])
    console.log("Deleting sections and tables from block");
    await Promise.all([...sections, ...tables].map((doc) => doc.deleteOne().exec()))
    next();
  } catch (error) {
    console.error("Cascade Delete Error On Blocks Model");
    throw error;
  }
})


module.exports = model("Blocks", blockSchema);
