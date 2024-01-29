const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    nationalID: {type: String, default:"", unique: true},
    telephone: {type: String, default: ""},
    address: {type: String, default: ""},
  },
  {
    timestamps: true,
  }
);

module.exports = model("Users", userSchema);
