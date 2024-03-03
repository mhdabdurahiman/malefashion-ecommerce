const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const cartHelper = require("../helpers/cartHelper")

const loadCheckout = async (req, res) => {
  try {
    userId = req.session.userId;
    const cartData = await Cart.findOne({userId: userId}).populate(
        "items.productId"
      );
    const userData = await User.findById({_id: userId}).populate('address').exec();
    const totalCartPrice = await cartHelper.totalCartPrice(userId);
    res.render("shop/checkout",{
        cartData: cartData,
        userData: userData,
        totalCartPrice: totalCartPrice,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
    loadCheckout
}