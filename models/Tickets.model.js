const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
  eventName: String,
  eventDate: String,
  eventTime: String,
  eventDescription: String,
  price: Number,
  qrCode: String,
  status: { type: String, default: "Available" },
  buyer: { type: Schema.Types.ObjectId, ref: "Users" },
  event: { type: Schema.Types.ObjectId, ref: "Events" },
});

module.exports = model("Tickets", ticketSchema);
