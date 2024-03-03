const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const isBlockedMiddleware = require( '../middleware/isBlockedMiddleware' );

const express = require("express");
const userRoute = express();

userRoute.get('/profile', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.loadUserProfile);

userRoute.post('/add-address', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doAddAddress);
userRoute.put('/edit-address', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doEditAddress)
userRoute.delete('/delete-address', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doDeleteAddress);

userRoute.put('/edit-details', authMiddleware.userAuth, isBlockedMiddleware.checkIsBlocked, userController.doEditDetails);


module.exports = userRoute;
