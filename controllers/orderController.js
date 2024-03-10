const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel")
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const cartHelper = require("../helpers/cartHelper");

const loadCheckout = async (req, res) => {
  try {
    userId = req.session.userId;
    const cartData = await Cart.findOne({userId: userId}).populate(
        "items.productId"
      );
    const userData = await User.findById({_id: userId}).populate('address').exec();
    const totalCartPrice = await cartHelper.totalCartPrice(userId);
    console.log(totalCartPrice);
    res.render("shop/checkout",{
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
    const{
      paymentOption,
      addressId,} = req.body;
    const totalAmount = await cartHelper.totalCartPrice(userId);
    const orderId = generateRandomOrderId();
    const address = await Address.findById({_id: addressId});
    const products = await cartHelper.totalCartPrice(userId);
    const productItems = products[0].items;
    const cartProducts = productItems.map((items) => ({
      productId: items.productId,
      quantity: items.quantity,
      price: (items.totalPrice / items.quantity)
    }));
    
    const totalPrice = totalAmount[0].total

    paymentOption === 'cod' ? orderStatus = 'Confirmed' : orderStatus = 'Pending';
    const order = new Order({
      userId: userId,
      orderId: orderId,
      products: cartProducts,
      totalPrice: totalPrice,
      paymentOption: paymentOption,
      orderStatus: orderStatus,
      address: address,
    })
    const orderPlaced = await order.save()
    // Decreasing the product quantity
    for (const items of cartProducts){
      const {productId, quantity} = items;
      await Product.updateOne({_id: productId},
        { $inc:{stock: -quantity}})
    }
    // Deleting the Cart
    await Cart.deleteOne({ userId: userId })
    res.status(200).json({success: true})
  } catch (error) {
    console.log(error.message)
  }
}

const loadOrderConfirmation = async (req, res) => {
  try {
    res.render("shop/order-confirmation")
  } catch (error) {
    console.log(error.message)
  }
}

const loadAdminOrderList = async (req, res) => {
  try {
    const orderData = await Order.find().populate('products');
    console.log(orderData);
    res.render("admin/adminOrderList",{
      orders: orderData
    })
  }
  catch(error){
    error.message
  }
}

module.exports = {
    loadCheckout,
    doPlaceOrder,
    loadOrderConfirmation,
    loadAdminOrderList,
}