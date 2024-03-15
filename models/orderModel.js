const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        orderStatus: {
          type: String,
          default: "Pending",
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentOption: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    orderStatus: {
      type: String,
      default: "Pending",
    },
    address: {
      type: Object,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
