const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    items : [{
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },

        quantity:{
            type: Number,
            default: 1
        },
        discountAmount:{
            type: Number,
            default: 0
        }
    }],

    coupon : {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }
})

module.exports = mongoose.model('Cart', cartSchema)