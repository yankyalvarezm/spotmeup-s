const { Schema, model } = require("mongoose");

const seatSchema = new Schema(
  {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    status: String,
    cprice: Number,
    row: String,
    column: Number,
    layout:{ type: Schema.Types.ObjectId, ref: "Layouts" },
    block: { type: Schema.Types.ObjectId, ref: "Blocks" },
    section:{ type: Schema.Types.ObjectId, ref: "Sections" },
  },
  {
    timestamps: true,
  }
);


seatSchema.pre('deleteOne', {document:true, query:false}, async function(next){
  const Sections = model("Sections")
  try {
    const section = await Sections.findById(this.section)
    if(section){
      section.seats = section.seats.filter(seatId => seatId.toString() != this._id.toString())
      await section.save()
    }
    else{
      console.error("section Not Found!")
    }
    next()
  } catch (error) {
    console.error("Cascade Delete Error On Seats Model");
    throw error;

  }
})

module.exports = model("Seats", seatSchema);
