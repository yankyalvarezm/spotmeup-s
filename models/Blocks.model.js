const { Schema, model } = require("mongoose");

const blockSchema = new Schema(
  {
    name: {type: String, default: ""},
    status: String,
    blockType: String,
    blockTableType: String, // If Block Type is "Circle" then this should be "addTableCircle" if "Square" then this should be "addTableSquare"
    capacity: Number,
    bprice: Number,
    maxRow: {type: Number, default: 0}, //Table Prop
    maxCol: {type: Number, default: 0}, //Table Prop
    maxSection: {type:Number, default: 4},
    maxTables: {type:Number, default: 4},
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 },
    border: { type: String, trim: true },
    borderRadius: { type: Number, default: 50 },
    borderLeftSize: { type: Number, default: 1 },
    borderRightSize: { type: Number, default: 1 },
    borderTopSize: { type: Number, default: 1 },
    borderBottomSize: { type: Number, default: 1 },
    borderColor: { type: String, default: "black", trim: true },
    borderLeftColor: { type: String, default: "black", trim: true },
    borderRightColor: { type: String, default: "black", trim: true },
    borderTopColor: { type: String, default: "black", trim: true },
    borderBottomColor: { type: String, default: "black", trim: true },
    fontSize: { type: Number, default: 15 },
    borderSize: { type: Number, default: 1 },
    color: { type: String, default: "white", trim: true },
    backgroundColor: { type: String, default: "black", trim: true },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
    justifyContent: { type: String, default: "", trim: true },
    alignItems: { type: String, default: "", trim: true },
    
    layout: { type: Schema.Types.ObjectId, ref: "Layouts" },

    sections: [{ type: Schema.Types.ObjectId, ref: "Sections" }],
    tables: [{ type: Schema.Types.ObjectId, ref: "Tables" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Blocks", blockSchema);
