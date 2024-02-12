var express = require("express");
const VenuesModel = require("../models/Venues.model");
const LayoutsModel = require("../models/Layouts.model");
const BlocksModel = require("../models/Blocks.model");
const SectionsModel = require("../models/Sections.model");
const TablesModel = require("../models/Tables.model");
const SeatsModel = require("../models/Seats.model");
var router = express.Router();

router.post("/", async (req, res) => {
  try {
    const alphabet = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    const venue = new VenuesModel({
      name: "Seed Venue",
      // description,
      maxCapacity: Math.floor(Math.random() * 100),
      contact: {
        email: "seed@seeding.com",
        owner: "Seed Data",
        telephone: "555-555-5555",
      },
      address: {
        street: "Seed Street",
        state: "Seed State",
        city: "Seed City",
        zip: "Seed Zip",
      },
    });

    const layout = new LayoutsModel({
      name: "Seed Layout",
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      width: Math.floor(Math.random() * 10),
      height: Math.floor(Math.random() * 10),
      status: "Available",
      capacity: Math.floor(Math.random() * 100),
    });

    venue.layouts.push(layout._id);
    await venue.save();

    const block = new BlocksModel({
      name: "Seed Blocks",
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      width: Math.floor(Math.random() * 10),
      height: Math.floor(Math.random() * 10),
      status: "Available",
      type: "Seed Type",
      capacity: Math.floor(Math.random() * 100),
      bprice: Math.floor(Math.random() * 100),
      maxSection: Math.floor(Math.random() * 100),
      maxTables: Math.floor(Math.random() * 100),
    });

    layout.blocks.push(block._id);
    await layout.save();

    const section = new SectionsModel({
      name: "Seed Section",
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      width: Math.floor(Math.random() * 10),
      height: Math.floor(Math.random() * 10),
      status: "Available",
      capacity: Math.floor(Math.random() * 100),
      sprice: Math.floor(Math.random() * 100),
      tickets: Math.floor(Math.random() * 100),
      maxCol: Math.floor(Math.random() * 100),
      maxRow: alphabet[Math.floor(Math.random() * alphabet.length - 1)],
    });

    const tableBlocks = new TablesModel({
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      width: Math.floor(Math.random() * 10),
      height: Math.floor(Math.random() * 10),
      status: "Available",
      cprice: Math.floor(Math.random() * 10),
      tickets: Math.floor(Math.random() * 10),
      isIncluded: true,
      number: Math.floor(Math.random() * 10),
    });
    
    block.sections.push(section._id);
    block.tables.push(tableBlocks._id);
    await block.save();
    await tableBlocks.save()

    const seat = new SeatsModel({
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      width: Math.floor(Math.random() * 10),
      height: Math.floor(Math.random() * 10),
      status: "Available",
      cprice: Math.floor(Math.random() * 10),
      row: alphabet[Math.floor(Math.random() * alphabet.length - 1)],
      column: Math.floor(Math.random() * 10),
    });

    const tableSection = new TablesModel({
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        width: Math.floor(Math.random() * 10),
        height: Math.floor(Math.random() * 10),
        status: "Available",
        cprice: Math.floor(Math.random() * 10),
        tickets: Math.floor(Math.random() * 10),
        isIncluded: true,
        number: Math.floor(Math.random() * 10),
      });
    
      section.seats.push(seat._id)
      section.tables.push(tableSection._id)
      await section.save()
      await tableSection.save()
      await seat.save()

      console.log("Seed Completed");
      return res.status(200).send(`Seed Completed!
                                    \nVenueID: ${venue._id}
                                    \nLayout: ${layout._id}
                                    \nBlock: ${block._id}
                                    \nSection: ${section._id}`)

  } catch (error) {
    console.log("Error Seeding Database");
  }
});


module.exports = router;