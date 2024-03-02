const mongoose = require( 'mongoose' );

const addressSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    mobile: {
        type: Number,
        required: true
    },

    landmark: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    pincode: {
        type: Number,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
        required: true,
        default: false,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('Address', addressSchema)