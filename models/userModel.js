const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    addressId: {

    },
    isVerified: {
        type: Number,
        default: 0,
    },
    is_blocked: {
        type: Boolean,
        required: true,
        default: false
    },
    createdDate:{
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("User", userSchema);