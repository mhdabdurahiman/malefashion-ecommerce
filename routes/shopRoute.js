const shopController = require( '../controllers/shopController' );
const authMiddleware = require( '../middleware/authMiddleware' );
const cartController = require( '../controllers/cartController' );

const express = require('express');
const path = require('path')
const shopRoute = express();

shopRoute.get("/", shopController.loadHome);

shopRoute.get("/shop", shopController.loadShop);
shopRoute.get("/product/:id", authMiddleware.userAuth, shopController.loadProductDetails);
shopRoute.get("/checkout", authMiddleware.userAuth, shopController.loadCheckout);

shopRoute.get("/cart" , authMiddleware.userAuth, cartController.loadCart);

shopRoute.get("/blog", shopController.loadBlog);
shopRoute.get("/contact", shopController.loadContact);
shopRoute.get("/about", shopController.loadAbout);

module.exports = shopRoute;