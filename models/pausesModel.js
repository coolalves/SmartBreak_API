const mongoose = require("mongoose");

const pausesSchema = new mongoose.Schema({
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  ideal: {
    type: Number,
    required: true,
    default: 30,
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Pause", pausesSchema);
