const shopController = require( '../controllers/shopController' );
const cartController = require( '../controllers/cartController' );
const authMiddleware = require( '../middleware/authMiddleware' );
const isBlockedMiddleware = require( '../middleware/isBlockedMiddleware' );


const express = require('express');
const path = require('path')
const shopRoute = express();

shopRoute.get("/", shopController.loadHome);

shopRoute.get("/shop", shopController.loadShop);
shopRoute.get("/product/:id", shopController.loadProductDetails);
shopRoute.get("/checkout", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, shopController.loadCheckout);

shopRoute.get("/cart" , authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, cartController.loadCart);
shopRoute.post("/add-to-cart", cartController.addToCart);
shopRoute.post("/decrease-product-quantity", cartController.decProductQuantity);
shopRoute.post("/remove-cart-item", cartController.removeCartItem);

shopRoute.get("/blog", shopController.loadBlog);
shopRoute.get("/contact", shopController.loadContact);
shopRoute.get("/about", shopController.loadAbout);

module.exports = shopRoute;