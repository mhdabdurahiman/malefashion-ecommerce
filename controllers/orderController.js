const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel")
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const cartHelper = require("../helpers/cartHelper");

const loadCheckout = async (req, res) => {
  try {
    const userId = req.session.userId;
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

    let orderStatus = '';
    paymentOption === 'cod' ? orderStatus = 'Placed' : orderStatus = 'Pending';
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

const loadAdminOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await Order.findById({_id: orderId}).populate('userId').populate('products.productId');
    console.log(orderData);
    res.render("admin/adminOrderDetails",{
      orderData: orderData
    })
  }
  catch(error){
    error.message
  }
}

const loadUserOrderDetails = async (req, res) => {
  try {
      const orderId = req.params.id;
      const orderData = await Order.findById({ _id: orderId }).populate('products.productId');
      console.log('orderData:',orderData.products);
      res.render('user/orderDetails',{
          orderData: orderData,
      })
  } catch (error) {
      console.log(error.message)
  }
}

const changeOrderStatus = async (req, res) => {
  try {
    console.log(req.body)
    const {orderId, status} = req.body;
    if ( status === 'Canceled'){
      const order = await Order.findOne({ _id: orderId })
      for (let product of order.products){
        await Product.updateOne({ _id: product.productId },{
          $inc: {stock: product.quantity}
        })
      }
      await Order.findOneAndUpdate({ _id: orderId },
        { $set: {orderStatus: status} })
    } else {
      await Order.findOneAndUpdate({ _id: orderId },
        { $set: {orderStatus: status} })
    }
    const orderData = await Order.findOne({ _id: orderId });
    res.status(200).json({success: true, status: orderData.orderStatus})
  } catch (error) {
    console.log(error.message)
  }
}

const doUserCancelProduct = async (req, res) => {
  try {
    console.log(req.body)
    const {orderId, status} = req.body;
    if ( status === 'Canceled'){
      const order = await Order.findOne({ _id: orderId })
      for (let product of order.products){
        await Product.updateOne({ _id: product.productId },{
          $inc: {stock: product.quantity}
        })
      }
      await Order.findOneAndUpdate({ _id: orderId },
        { $set: {orderStatus: status} })
    } else {
      await Order.findOneAndUpdate({ _id: orderId },
        { $set: {orderStatus: status} })
    }
    const orderData = await Order.findOne({ _id: orderId });
    res.status(200).json({success: true, status: orderData.orderStatus})
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = {
    loadCheckout,
    doPlaceOrder,
    loadOrderConfirmation,
    loadAdminOrderList,
    loadAdminOrderDetails,
    loadUserOrderDetails,
    changeOrderStatus,
    doUserCancelProduct,
}