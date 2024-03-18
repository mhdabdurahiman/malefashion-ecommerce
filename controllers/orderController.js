const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const cartHelper = require("../helpers/cartHelper");
const onlinePayment = require("../utils/onlinePayment");
const crypto = require("crypto");

const loadCheckout = async (req, res) => {
  try {
    const userId = req.session.userId;
    const cartData = await Cart.findOne({ userId: userId }).populate(
      "items.productId"
    );
    const userData = await User.findById({ _id: userId })
      .populate("address")
      .exec();
    const totalCartPrice = await cartHelper.totalCartPrice(userId);
    console.log(totalCartPrice);
    res.render("shop/checkout", {
      cartData: cartData,
      userData: userData,
      totalCartPrice: totalCartPrice,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const generateRandomOrderId = () => {
  const randomString = Math.random().toString(10).substring(2, 8);
  return `ORD${randomString}`;
};

const doPlaceOrder = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { paymentOption, addressId } = req.body;
    const totalAmount = await cartHelper.totalCartPrice(userId);
    const orderId = generateRandomOrderId();
    const address = await Address.findById({ _id: addressId });
    const products = await cartHelper.totalCartPrice(userId);
    const productItems = products[0].items;
    const cartProducts = productItems.map((items) => ({
      productId: items.productId,
      quantity: items.quantity,
      price: items.totalPrice / items.quantity,
    }));

    const totalPrice = totalAmount[0].total;

    let amountPayable = totalPrice;
    let orderStatus;
    paymentOption === "cod"
      ? (orderStatus = "Placed")
      : (orderStatus = "Pending");
    const order = new Order({
      userId: userId,
      orderId: orderId,
      products: cartProducts,
      totalPrice: totalPrice,
      paymentOption: paymentOption,
      orderStatus: orderStatus,
      address: address,
      amountPayable: amountPayable,
    });
    console.log('order',order);
    const savedOrder = await order.save();
    // Decreasing the product quantity
    for (const items of cartProducts) {
      const { productId, quantity } = items;
      await Product.updateOne(
        { _id: productId },
        { $inc: { stock: -quantity } }
      );
    }
    // Deleting the Cart
    await Cart.deleteOne({ userId: userId });
    if (paymentOption === "cod") {
      res.status(200).render("shop/order-confirmation",{orderDetails:savedOrder}).json({ success: true });
    } else if (paymentOption === "online") {
      const razorpayOnlinePayment = await onlinePayment.razorpayPayment(
        orderId,
        amountPayable
      );
      res.json({
        razorpayOnlinePayment: razorpayOnlinePayment,
        success: false,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { response, order } = req.body;
    console.log(req.body, process.env.RAZORPAY_KEY_SECRET)
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        response.razorpay_order_id + "|" + response.razorpay_payment_id,
        "utf-8"
      )
      .digest("hex");

    console.log("generatedSignature: ", generated_signature);
    console.log("razorpaySignature: ", response.razorpay_signature);

    if (generated_signature === response.razorpay_signature) {
      const orderId = order.receipt; // Assuming order.reciept holds the orderId

      const orderData = await Order.updateOne(
        { orderId: orderId },
        { 
          $set: { 
            paymentId: response.razorpay_payment_id,
            orderStatus: "Placed",
            "products.$[elem].orderStatus": "Placed" // Update the orderStatus of each product
          }
        },
        { 
          arrayFilters: [{ "elem.orderStatus": "Pending" }] // Filter products with orderStatus "Pending"
        }
      );
      console.log("success payment order data:", orderData)
      res.status(200).json({ paymentVerified: true });
    } else {
      res.status(400).json({ paymentVerified: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadOrderConfirmation = async (req, res) => {
  try {
    res.render("shop/order-confirmation");
  } catch (error) {
    console.log(error.message);
  }
};

const loadPaymentFailure = async (req, res) => {
  try {
    res.render("shop/payment-failure");
  } catch (error) {
    console.log(error.message);
  }
};

const loadAdminOrderList = async (req, res) => {
  try {
    const orderData = await Order.find()
      .sort({ createdAt: -1 })
      .populate("products");
    console.log(orderData);
    res.render("admin/adminOrderList", {
      orders: orderData,
    });
  } catch (error) {
    error.message;
  }
};

const loadAdminOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await Order.findById({ _id: orderId })
      .populate("userId")
      .populate("products.productId");
    res.render("admin/adminOrderDetails", {
      orderData: orderData,
    });
  } catch (error) {
    error.message;
  }
};

const loadUserOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await Order.findById({ _id: orderId }).populate(
      "products.productId"
    );
    console.log("orderData:", orderData.products);
    res.render("user/orderDetails", {
      orderData: orderData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, status } = req.body;
    if (status === "Canceled") {
      const order = await Order.findOne({ _id: orderId });
      for (let product of order.products) {
        await Product.updateOne(
          { _id: product.productId },
          {
            $inc: { stock: product.quantity },
          }
        );
      }
      await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { orderStatus: status } }
      );
    } else {
      await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { orderStatus: status } }
      );
    }
    const orderData = await Order.findOne({ _id: orderId });
    res.status(200).json({ success: true, status: orderData.orderStatus });
  } catch (error) {
    console.log(error.message);
  }
};

const doUserCancelProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, status } = req.body;
    if (status === "Canceled") {
      const order = await Order.findOne({ _id: orderId });
      for (let product of order.products) {
        await Product.updateOne(
          { _id: product.productId },
          {
            $inc: { stock: product.quantity },
          }
        );
      }
      await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { orderStatus: status } }
      );
    } else {
      await Order.findOneAndUpdate(
        { _id: orderId },
        { $set: { orderStatus: status } }
      );
    }
    const orderData = await Order.findOne({ _id: orderId });
    res.status(200).json({ success: true, status: orderData.orderStatus });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadCheckout,
  doPlaceOrder,
  verifyPayment,
  loadOrderConfirmation,
  loadPaymentFailure,
  loadAdminOrderList,
  loadAdminOrderDetails,
  loadUserOrderDetails,
  changeOrderStatus,
  doUserCancelProduct,
};
