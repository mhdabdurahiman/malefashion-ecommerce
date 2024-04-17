const Cart = require("../models/cartModel");

const fetchCartCount = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      res.locals.cartCount = 0;
      return next();
    }
      const cart = await Cart.findOne({ userId: userId });
      console.log('cart', cart);

      let totalItems = 0;
      if (cart.items && cart.items.length > 0) {
        totalItems = cart.items.length;
        console.log(totalItems);
        res.locals.cartCount = totalItems;
        next();
      } else {
        res.locals.cartCount = 0;
        next();
      }
  } catch (error) {
    console.error("Error fetching cart count: ", error);
    res.locals.cartCount = 0;
    next();
  }
};

module.exports = fetchCartCount;
