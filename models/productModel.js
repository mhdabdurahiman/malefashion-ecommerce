const mongoose = require( 'mongoose' );

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    isList: {
        type: Boolean,
        default: true
    },
    offer : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Offer'
  }


  },
  {timestamps: true });
  
  module.exports = mongoose.model("Product", productSchema);