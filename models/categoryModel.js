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
  },
  offer : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Offer'
}
});

module.exports = mongoose.model("Category", categorySchema);