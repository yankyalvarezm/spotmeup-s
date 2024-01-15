const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: String,
    createdAt: Date,
    images: String,
    status: String,
    capacity: Number,
    description: String,
    date: Date,
    time: Date,
    address: String,
    tickets: Number,
    venue: [{ type: Schema.Types.ObjectId, ref: "Venues" }],
    users: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Events", eventSchema);
