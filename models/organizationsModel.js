const mongoose = require("mongoose");

const organizationsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  battery_full: {
    type: Number,
    required: false,
    default: 10000
  },
}, { collection: 'Organizations' });

module.exports = mongoose.model("Organization", organizationsSchema);
