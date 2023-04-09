const mongoose = require("mongoose");

const routinesSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  days: {
    type: Array,
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
}, { collection: 'Routines' });

module.exports = mongoose.model("Routine", routinesSchema);
