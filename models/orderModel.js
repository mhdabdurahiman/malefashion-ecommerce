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
      required: true,
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
    paymentStatus: {
      type: String,
      enum: ["Pending", "Failed", "Completed"],
      default: "Pending",
    },
    paymentId: {
      type: String,
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Placed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: "Pending",
    },
    address: {
      type: Object,
      required: true,
    },
    amountPayable: {
      type: Number,
      required: false,
    },
    shippingCost: {
      type: Number,
      default: 100,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      required: true,
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
