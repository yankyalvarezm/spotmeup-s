const { Schema, model } = require("mongoose");




const venueSchema = new Schema(
  {
    name: String,
    maxCapacity: Number,
    contact: {
      email: String,
      owner: String,
      telephone: String,
    },
    address:{
      street:{type: String, required:true},
      state: {type: String, required:true},
      city: {type: String, required:true},
      zip: {type: String, required:true},
    },
    layouts: [{ type: Schema.Types.ObjectId, ref: "Layouts" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Venues", venueSchema);
