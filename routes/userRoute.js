const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const cookieParser = require("cookie-parser");

const express = require("express");
const path = require("path");
const userRoute = express();

userRoute.set("view engine", "ejs");
userRoute.set("views", path.join(__dirname, "../views/user"));

const bodyParser = require("body-parser");
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));
userRoute.use(cookieParser());

userRoute.get("/", userController.loadHome);
userRoute.get("/login", authMiddleware.userLoggedOut, userController.loadUserLogin);
userRoute.get("/register", authMiddleware.userLoggedOut, userController.loadUserRegister);
userRoute.get("/shop", userController.loadShop);
userRoute.get("/about", userController.loadAbout);
userRoute.get("/cart", authMiddleware.userAuth, userController.loadCart);
userRoute.get("/product", authMiddleware.userAuth, userController.loadProductDetails);
userRoute.get("/blog", userController.loadBlog);
userRoute.get("/checkout", authMiddleware.userAuth, userController.loadCheckout);
userRoute.get("/contact", userController.loadContact);
userRoute.get("/logout", authMiddleware.userAuth, userController.doUserLogout);
// userRoute.get("/enter-otp", authMiddleware.userLoggedOut, userController.loadVerifyOTP);

userRoute.post("/register", authMiddleware.userLoggedOut, userController.enterUserDetails);
userRoute.post("/login", authMiddleware.userLoggedOut, userController.doUserLogin);
userRoute.post("/send-otp", authMiddleware.userLoggedOut, userController.doVerfiyOtp)

module.exports = userRoute;
