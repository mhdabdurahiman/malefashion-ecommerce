const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  
  address : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Address'
  }],

  isVerified: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
