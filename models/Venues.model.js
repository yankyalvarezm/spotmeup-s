const { Schema, model } = require("mongoose");

const venueSchema = new Schema(
  {
    name: String,
    maxCapacity: Number,
    owner: String,
    contact: String,
    email: String,
    telephone: Number,
    address: String,
    layouts: [{ type: Schema.Types.ObjectId, ref: "Layouts" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Venues", venueSchema);
