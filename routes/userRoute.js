const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController")
const authMiddleware = require("../middleware/authMiddleware");
const isBlockedMiddleware = require( '../middleware/isBlockedMiddleware' );

const express = require("express");
const userRoute = express();

userRoute.get('/profile', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.loadUserProfile);

userRoute.post('/add-address', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doAddAddress);
userRoute.put('/edit-address', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doEditAddress);
userRoute.delete('/delete-address', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doDeleteAddress);

userRoute.put('/edit-details', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doEditDetails);

userRoute.get('/order-details/:id', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, orderController.loadUserOrderDetails);

userRoute.get('/wallet-history', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.getWalletHistory);

userRoute.get( '/invoice_download', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.downloadInvoice)

module.exports = userRoute;
