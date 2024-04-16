const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true,
    },
    discountType:{
        type: String,
        enum: ['percent', 'fixed'],
        required: true,
    },
    discountAmount:{
        type: Number,
        required: true,
    },
    minOrderAmount:{
        type: Number,
        required: true,
    },
    maxUses:{
        type: Number,
        required: true,
    },
    expiresAt:{
        type: Date,
        required: true,
    },
    usedBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;