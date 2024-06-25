const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: String,
    images: String,
    eventType: String,
    status: {type: String, default: "Available"},
    hasVenue:Boolean,
    // capacity: {type: Number, default: 5},
    description: {type: String, default: " "},
    date: {type: String},
    time: {type: String, default: "12:00:00"},
    address: Object,
    ticketAmount: {type: Number, default: 5},
    venue: { type: Schema.Types.ObjectId, ref: "Venues" },
    layout: {type: Schema.Types.ObjectId, ref: "Layouts"},
    tickets: [{type: Schema.Types.ObjectId, ref:"Tickets"}],
    host: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Events", eventSchema);
