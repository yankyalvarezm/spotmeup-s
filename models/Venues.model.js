const { Schema, model } = require("mongoose");




const venueSchema = new Schema(
  {
    name: {type: String, trim:true},
    descrtiption: {type: String, trim: true, default:"No Description"},
    maxCapacity: Number,
    contact: {
      email: String,
      owner: String,
      telephone: String,
    },
    address:Object,
    // address:{
    //   street:{type: String, required:true, trim: true},
    //   state: {type: String, required:true, trim: true},
    //   city: {type: String, required:true, trim: true},
    //   zip: {type: String, required:true, trim: true},
    // },
    image: {type: String, trim: true, default:"https://res.cloudinary.com/dg2rwod7i/image/upload/v1707111848/spotmeup/hwsw7dy5a9odkx6gkbot.jpg"},
    layouts: [{ type: Schema.Types.ObjectId, ref: "Layouts" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Venues", venueSchema);
