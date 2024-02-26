const Product = require("../models/productModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const cartHelper = require("../helpers/cartHelper")

const loadCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log('userid',userId)
    const cartData = await Cart.findOne({ userId: userId }).populate(
      "items.productId"
    );
    const totalCartPrice = await cartHelper.totalCartPrice(userId);
    console.log('totalprice:',totalCartPrice)
    console.log("cartData:",cartData);
    res.render("shop/shopping-cart", {
      cartData: cartData,
      totalCartPrice: totalCartPrice
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  if (req.session.userId){
    try {
      const productId = req.body.productId;
      console.log(productId);
      const userId = req.session.userId;
      console.log(userId)
      const cartData = await Cart.findOne({ userId: userId })
      console.log('cartdata:',cartData)
      const product = await Product.findOne({ _id: productId }, { stock: 1 });
      const stockQuantity = product.stock;
      console.log("stock quantity:", stockQuantity)
      if (stockQuantity > 0) {
        if (cartData) {
          //if product exist in cart
          const productExist = cartData.items.find(
            item => item.productId == productId
          );
          console.log("productexist",productExist)
  
          if (productExist) {
            const availableStock = stockQuantity - productExist.quantity;
            if (availableStock > 0) {
              // quantity increased
              const cartItems = await Cart.updateOne(
                { userId: userId, "items.productId": productId },
                { $inc: { "items.$.quantity": 1 } }
              );
              res.status(200).json({ success: true, message: "Added to cart" });
            } else {
              const cartItem = await Cart.updateOne(
                { userId: userId },
                { $push: { items: { productId: productId } } }
              );
              console.log('Added to cart')
              res.status(200).json({
                success: true,
                message: "Added to cart",
                newItem: true,
              });
            }
          } else {
            const cartItems = await Cart.updateOne(
              { userId: userId},
              { $push : 
                { items: {productId: productId} } 
              }
            );
            res.status(200).json({ 
              success: true,
              message: 'Added to cart',
              newItem: true,
            })
          }
        }
        //if cart doesn't exist
        else {
          const newCart = new Cart({
            userId: userId,
            items: [{ productId: productId }],
          });
          await newCart.save();
          res.status(200).json({
            success: true,
            message: "Added to cart",
          });
        }
        // If product stock is empty
      } else {
        res.status(404).json({
          error: true,
          message: "Out of stock",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }else {
    res.setHeader('Content-Type', 'application/json');
    res.status(401).json({ authenticated: false })
  }
};

const decProductQuantity = async (req, res) => {
  try {
    const userId = req.session.userId;
    const productId = req.body.productId;
    const productQtyData = await Cart.findOne(
      { userId: userId, "items.productId": productId },
      { 'items.quantity.$':1}
    )
    const productQty = productQtyData.items[0].quantity
    console.log('itemQuantity:',productQty);
    if (productQty>0){
      const cartData = await Cart.updateOne(
        { userId: userId, "items.productId": productId },
        { $inc: { "items.$.quantity": -1 }}
      );
    }
    res.status(200).json({success: true})
  } catch (error) {
    console.log(error.message)
  }
}

const removeCartItem = async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const userId = req.session.userId;
    const cartData = await Cart.updateOne({ userId: userId, 'items._id': itemId},
      {$pull : { items: {_id : itemId}}});
      res.status(200).json({success: true})
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  loadCart,
  addToCart,
  decProductQuantity,
  removeCartItem
};
