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

blockSchema.pre('deleteOne', async (next) => {
  try {

    const [sections, tables] = await Promise.all([Sections.find({block:this._id}), Tables.find({block:this._id})])
    console.log("Deleting sections and tables from block");
    await Promise.all([...sections, ...tables].map((doc) => {console.log("Deleting"); doc.deleteOne()}))
    // await Promise.all(this.sections.map(async (sectionId) => {
    //   const section = await Sections.findById(sectionId);
    //   await section.remove()
    // }))
    // await Promise.all(this.tables.map(async (tableId) => {
    //   const table = await Tables.findById(tableId)
    //   await table.remove()
    // }))

    next();
  } catch (error) {
    console.error("Cascade Delete Error On Blocks Model");
    throw error;
  }
})

module.exports = model("Blocks", blockSchema);
