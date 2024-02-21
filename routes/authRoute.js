const authenticationController = require("../controllers/authenticationController");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const authRoute = express();

// User-Authentication-routes
authRoute.get("/login", authMiddleware.isAlreadyLoggedIn , authMiddleware.userLoggedOut, authenticationController.loadUserLogin);
authRoute.get("/register", authMiddleware.userLoggedOut, authenticationController.loadUserRegister);
authRoute.post("/register", authMiddleware.userLoggedOut, authenticationController.enterUserDetails);
authRoute.post("/login", authMiddleware.userLoggedOut, authenticationController.doUserLogin);
authRoute.post("/send-otp", authMiddleware.userLoggedOut, authenticationController.doVerfiyOtp);
// userRoute.get("/enter-otp", authMiddleware.userLoggedOut, authenticationController.loadVerifyOTP);
authRoute.get("/logout", authMiddleware.userAuth, authenticationController.doUserLogout);

module.exports = authRoute;