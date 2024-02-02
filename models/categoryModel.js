const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isList: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model("Category", categorySchema);