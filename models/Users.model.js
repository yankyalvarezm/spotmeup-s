const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    telephone: Number,
    email: String,
    Address: String,
    nationalID: String,
    createdAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Users", userSchema);
