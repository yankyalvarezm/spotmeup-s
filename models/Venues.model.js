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
    image: {type: String, trim:true, default:"https://res.cloudinary.com/dg2rwod7i/image/upload/v1707111848/spotmeup/hwsw7dy5a9odkx6gkbot.jpg"},
    layouts: [{ type: Schema.Types.ObjectId, ref: "Layouts" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Venues", venueSchema);
