const Wishlist = require("../models/wishlistModel");

const loadWishlist = async (req, res) => {
  try {
    const userId = req.session.userId;
    const wishlistData = await Wishlist.findOne({ userId: userId }).populate(
      "products"
    );
    res.render("shop/wishlist",{
        wishlistData: wishlistData,
    });
  } catch (error) {
    console.log(error.message);
  }
};



const addToWishlist = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.session.userId;
  
      const wishlistData = await Wishlist.findOne({ userId: userId });
      if (wishlistData) {
        const productExist = wishlistData.products.find(item => item.equals(productId));
        if (productExist) {
          return res.status(200).json({
            error: true,
            message: "Product already in wishlist",
          });
        } else {
          await Wishlist.updateOne(
            { userId: userId },
            { $push: { products: productId } } 
          );
        }
      } else {
        await Wishlist.create({
          userId: userId,
          products: [productId], 
        });
      }
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: error.message });
    }
  };
  const removeFromWishlist = async (req, res) => {
    try {
      const itemId = req.body.productId;
      const userId = req.session.userId;
      
      const wishlistData = await Wishlist.updateOne(
        { userId: userId },
        { $pull: { products: itemId } } 
      );
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: error.message });
    }
  };

module.exports = {
  loadWishlist,
  addToWishlist,
  removeFromWishlist,
};
