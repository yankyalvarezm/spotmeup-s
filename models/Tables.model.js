const { Schema, model } = require("mongoose");

const tableSchema = new Schema(
  {
    tableType: String,
    status: String,
    cprice: Number,
    tickets: Number,
    isIncluded: Boolean,
    number: Number,
    name: {type: String, default: ""},
    x: {type: Number, default:0},
    y: {type: Number, default:0},
    z: {type: Number, default:0},
    row: {type: Number, default:0},
    col: {type: Number, default:0},
    width: {type: Number, default: 100},
    height: {type: Number, default: 100},
    border: {type:String, trim:true},
    borderRadius: {type:Number, default: 50},
    borderLeftSize: {type: Number, default:1},
    borderRightSize: {type: Number, default:1},
    borderTopSize: {type: Number, default:1},
    borderBottomSize: {type: Number, default:1},
    borderColor: {type: String, default: "black", trim:true},
    borderLeftColor: {type: String, default: "black", trim:true},
    borderRightColor: {type: String, default: "black", trim:true},
    borderTopColor: {type: String, default: "black",trim:true},
    borderBottomColor: {type: String, default: "black",trim:true},
    fontSize: {type: Number, default: 15},
    borderSize: {type:Number, default: 1},
    color: {type: String, default: "white", trim:true},
    backgroundColor: {type: String, default: "black", trim:true},
    justifyContent: {type: String, default:"", trim:true},
    alignItems: {type: String, default:"", trim:true},
    layout:{ type: Schema.Types.ObjectId, ref: "Layouts" },
    block: { type: Schema.Types.ObjectId, ref: "Blocks"},
    section:{ type: Schema.Types.ObjectId, ref: "Sections" }
  },
  {
    timestamps: true,
  }
);

tableSchema.pre('deleteOne', {document:true, query:false}, async function(next) {
  const Blocks = model("Blocks")
  const Sections = model("Sections")
  const Tables = model("Tables")
  try {
    const block = await Blocks.findById(this.block)
    const section = await Sections.findById(this.section)
    if(block){
      let start = block.tables.indexOf(this._id)
      block.tables = block.tables.filter(id => id.toString() != this._id.toString())
      await block.save()
      for(let i=start;i<block.tables.length;i++){
        const table = await Tables.findById(block.tables[i])
        if(table){
          table.number=i
          await table.save()
        }
      }
    }
    else if(section){
      let start = section.tables.indexOf(this._id)
      section.tables = section.tables.filter(id => id.toString() != this._id.toString())
      await section.save()
      for(let i=start ;i<section.tables.length;i++){
        const table = await Tables.findById(section.tables[i])
        if(table){
          table.number=i
          await table.save()
        }
      }
    }
    else{
      console.log(this.block, this.section);
      console.error("block and/or section Not Found!")
    }
    next()
  } catch (error) {
    console.error(error)
    throw error
  }
})

module.exports = model("Tables", tableSchema);
