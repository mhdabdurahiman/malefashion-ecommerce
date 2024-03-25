const shopController = require( '../controllers/shopController' );
const cartController = require( '../controllers/cartController' );
const orderController = require( '../controllers/orderController' );
const wishlistController = require( '../controllers/wishlistController' );
const authMiddleware = require( '../middleware/authMiddleware' );
const isBlockedMiddleware = require( '../middleware/isBlockedMiddleware' );


const express = require('express');
const shopRoute = express();

shopRoute.get("/", shopController.loadHome);

shopRoute.get("/shop", shopController.loadShop);
shopRoute.get("/product/:id", shopController.loadProductDetails);

shopRoute.get("/cart" , authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, cartController.loadCart);
shopRoute.post("/add-to-cart", cartController.addToCart);
shopRoute.post("/decrease-product-quantity", cartController.decProductQuantity);
shopRoute.post("/remove-cart-item", cartController.removeCartItem);

shopRoute.get("/wishlist", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, wishlistController.loadWishlist);
shopRoute.post("/add-to-wishlist", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked ,wishlistController.addToWishlist);
shopRoute.post("/remove-from-wishlist", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, wishlistController.removeFromWishlist);

shopRoute.get("/checkout", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.loadCheckout);
shopRoute.get("/order-confirmation", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.loadOrderConfirmation);
shopRoute.post("/place-order", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.doPlaceOrder);
shopRoute.post("/verify-razorpay-payment", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.verifyPayment);
shopRoute.get("/payment-failure", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.loadPaymentFailure);

shopRoute.post("/cancel-order", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.doUserCancelOrder);
shopRoute.post("/return-order", authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.doUserReturnOrder);

shopRoute.get("/blog", shopController.loadBlog);
shopRoute.get("/contact", shopController.loadContact);
shopRoute.get("/about", shopController.loadAbout);

module.exports = shopRoute;