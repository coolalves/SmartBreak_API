const mongoose = require("mongoose");

const valuesSchema = new mongoose.Schema(
  {
    electricityValue: {
      type: Number,
      required: true,
    },
    lastUpdate: {
      type: Date,
      required: true,
    },
  },
  { collection: "Values" }
);

module.exports = mongoose.model("Value", valuesSchema);
