const { Schema, model, mongoose } = require("mongoose");
const Blocks = require("./Blocks.model");


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
    number: Number,
    block:{type:Schema.Types.ObjectId, ref: "Blocks"},
    section:{type:Schema.Types.ObjectId, ref: "Sections"}
  },
  {
    timestamps: true,
  }
);

tableSchema.pre('deleteOne', {document:true, query:false}, async function(next) {
  const Tables = mongoose.model("Tables")
  try {
    const block = await Blocks.findById(this.block)
    let start = block.tables.indexOf(this._id)
    block.tables = block.tables.filter(id => id !== this._id)
    await block.save()
    for(let i=start ;i<block.tables.length;i++){
      const table = await Tables.findById(block.tables[i])
      console.log(table);
      table.number=i
      await table.save()
    }
    next()
  } catch (error) {
    throw error
  }
})

module.exports = model("Tables", tableSchema);
