const Product = require("../models/productModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const cartHelper = require("../helpers/cartHelper");
const Coupon = require("../models/couponModel");
const couponHelper = require("../helpers/couponHelper");

const loadCart = async (req, res) => {
  try {
    const userId = req.session.userId;
    let discounted;
    const cartData = await Cart.findOne({ userId: userId }, ).populate({
      path: "items.productId",
      populate: [
        {
          path: "category",
          populate: {
            path: "offer",
          },
        },
        {
          path: "offer",
        },
      ],
    });
    const totalCartPrice = await cartHelper.totalCartPrice(userId);
    console.log("totalprice in the cart:  ", totalCartPrice);
    if (cartData && cartData.items.length > 0) {
      cartData.items = cartData.items.map((items) => {
        if (items.productId && items.productId.offer) {
          if (
            items.productId?.offer?.startingDate <= new Date() &&
            items.productId?.offer?.expiryDate >= new Date()
          ) {
            items.productId.price = (
              items.productId.price *
              (1 - items.productId.offer.percentage / 100)
            ).toFixed(0);
          } else if (
            items.productId?.category?.offer?.startingDate <= new Date() &&
            items.productId?.category?.offer?.expiryDate >= new Date()
          ) {
            items.productId.price = (
              (items.productId.price || 0) *
              (1 - items.productId.category.offer.percentage / 100)
            ).toFixed(0);
          }
        }
        return items;
      });
      console.log("cartData item after updation:", cartData);
    }
    if (
      cartData &&
      cartData.coupon &&
      totalCartPrice &&
      totalCartPrice.length > 0
    ) {
      discounted = await couponHelper.discountPrice(
        cartData.coupon,
        totalCartPrice[0].total
      );
    }
    const availableCoupons = await Coupon.find({
      expiresAt: { $gte: new Date() },
    });
    res.render("shop/shopping-cart", {
      cartData: cartData,
      totalCartPrice: totalCartPrice,
      availableCoupons: availableCoupons,
      discounted: discounted,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  if (req.session.userId) {
    try {
      const productId = req.body.productId;
      const userId = req.session.userId;
      const cartData = await Cart.findOne({ userId: userId });
      const product = await Product.findOne({ _id: productId }, { stock: 1 });

      if (!product) {
        return res.status(404).json({
          error: true,
          message: "Product not found",
        });
      }

      const stockQuantity = product.stock;

      if (stockQuantity <= 0) {
        return res.status(404).json({
          error: true,
          outOfStock: true,
          message: "Out of stock",
        });
      }

      if (cartData) {
        // If product exists in cart
        const productExist = cartData.items.find(
          (item) => item.productId == productId
        );

        // Calculate the available stock
        const availableStock = productExist
          ? stockQuantity - productExist.quantity
          : stockQuantity;

        if (availableStock > 0) {
          let newQuantity = 1;

          if (productExist) {
            // Quantity increased
            newQuantity = productExist.quantity + 1;

            if (newQuantity > stockQuantity) {
              return res.status(400).json({
                error: true,
                message: "Exceeds available stock",
              });
            }

            const cartItems = await Cart.updateOne(
              { userId: userId, "items.productId": productId },
              { $set: { "items.$.quantity": newQuantity } }
            );

            return res
              .status(200)
              .json({ success: true, message: "Quantity increased in cart" });
          } else {
            if (availableStock > 0) {
              const cartItems = await Cart.updateOne(
                { userId: userId },
                {
                  $push: {
                    items: { productId: productId, quantity: 1 },
                  },
                }
              );
              return res
                .status(200)
                .json({ success: true, message: "Added to cart" });
            } else {
              return res.status(400).json({
                error: true,
                message: "Exceeds available stock",
              });
            }
          }
        } else {
          // Handle the case where product already exists in cart with maximum quantity
          return res.status(400).json({
            error: true,
            message: "Exceeds available stock",
          });
        }
      } else {
        // If cart doesn't exist
        const newCart = new Cart({
          userId: userId,
          items: [{ productId: productId, quantity: 1 }],
        });
        await newCart.save();
        return res.status(200).json({
          success: true,
          message: "Added to cart",
        });
      }
    } catch (error) {
      console.log(error.message);
      res.redirect("/error500");
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ authenticated: false });
  }
};

const decProductQuantity = async (req, res) => {
  try {
    const userId = req.session.userId;
    const productId = req.body.productId;
    const productQtyData = await Cart.findOne(
      { userId: userId, "items.productId": productId },
      { "items.quantity.$": 1 }
    );
    const productQty = productQtyData.items[0].quantity;
    console.log("itemQuantity:", productQty);
    if (productQty > 1) {
      const cartData = await Cart.updateOne(
        { userId: userId, "items.productId": productId },
        { $inc: { "items.$.quantity": -1 } }
      );
      res.status(200).json({ success: true });
    } else {
      res.json({ isQuantityOne: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removeCartItem = async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const userId = req.session.userId;
    const cartData = await Cart.updateOne(
      { userId: userId, "items._id": itemId },
      { $pull: { items: { _id: itemId } } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { couponCode, total } = req.body;
    console.log("Coupon code and total: ", couponCode, total);
    const { userId } = req.session;
    const coupon = await Coupon.find({ code: couponCode });
    if (coupon && coupon.length > 0) {
      const now = new Date();
      if (coupon[0].expiresAt >= now) {
        const userIds = coupon[0].usedBy.map((userId) => String(userId));
        const userExist = userIds.includes(userId);
        if (userExist) {
          res.json({
            success: false,
            message: "Coupon already used by the user",
          });
        } else {
          if (total < coupon[0].minOrderAmount) {
            res.json({
              success: false,
              message: "Order amount is not greater than Minimum order amount.",
            });
          } else {
            await Cart.updateOne(
              { userId: userId },
              {
                $set: {
                  coupon: coupon[0]._id,
                },
              }
            );
            console.log("else part worked in applying coupon");
            const cart = await Cart.findOne({ userId: userId });
            let discounted;
            if (cart.coupon) {
              discounted = await couponHelper.discountPrice(cart.coupon, total);
            }
            res.json({
              success: true,
              message: "Coupon Applied successfully",
              discounted: discounted,
            });
          }
        }
      } else {
        res.json({ success: false, message: "Invalid Coupon" });
      }
    } else {
      res.json({ success: false, message: "Invalid Coupon" });
    }
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

module.exports = {
  loadCart,
  addToCart,
  decProductQuantity,
  removeCartItem,
  applyCoupon,
};
