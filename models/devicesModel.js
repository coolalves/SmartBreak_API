const mongoose = require("mongoose");

const devicesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  energy: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    required: true,
    default: true
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Device", devicesSchema);
