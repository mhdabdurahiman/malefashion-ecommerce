const authenticationController = require("../controllers/authenticationController");
const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");
const authRoute = express();

// User-Authentication-routes
authRoute.get("/login", authMiddleware.isAlreadyLoggedIn , authMiddleware.userLoggedOut, authenticationController.loadUserLogin);
authRoute.get("/register", authMiddleware.userLoggedOut, authenticationController.loadUserRegister);
authRoute.post("/register", authMiddleware.userLoggedOut, authenticationController.enterUserDetails);
authRoute.post("/login", authMiddleware.userLoggedOut, authenticationController.doUserLogin);
authRoute.post("/send-otp", authMiddleware.userLoggedOut, authenticationController.doVerfiyRegisterOtp);
authRoute.post("/resend-otp", authMiddleware.userLoggedOut, authenticationController.doResendOtp);
authRoute.get("/logout", authMiddleware.userAuth, authenticationController.doUserLogout);
authRoute.post("/reset-password", authMiddleware.userAuth, authenticationController.resetPassword);

authRoute.get("/forgot-password", authMiddleware.userLoggedOut, authenticationController.loadForgotPasswordEmailInput);
authRoute.post("/forgot-password-email", authMiddleware.userLoggedOut, authenticationController.verifyForgotPasswordEmail);
authRoute.post("/forgot-password-otp", authMiddleware.userLoggedOut, authenticationController.doVerifyForgotPasswordOtp);
authRoute.post("/reset-forgot-password", authMiddleware.userLoggedOut, authenticationController.doResetForgotPassword);

module.exports = authRoute;