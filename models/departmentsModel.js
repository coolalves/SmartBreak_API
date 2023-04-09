const mongoose = require("mongoose");

const departmentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  organization: {
    type: String,
    required: true,
    default: "",
  },
}, { collection: 'Departments' });

module.exports = mongoose.model("Department", departmentsSchema);
