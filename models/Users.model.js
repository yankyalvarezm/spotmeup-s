const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    telephone: Number,
    email: {type: String, unique: true, required: true, trim: true},
    address: String,
    nationalID: {type: String, unique: true},
    password: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Users", userSchema);
