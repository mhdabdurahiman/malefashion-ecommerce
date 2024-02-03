const authenticationController = require("../controllers/authenticationController")
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


userRoute.get("/shop", userController.loadShop);
userRoute.get("/about", userController.loadAbout);
userRoute.get("/cart", authMiddleware.userAuth, userController.loadCart);
userRoute.get("/product", authMiddleware.userAuth, userController.loadProductDetails);
userRoute.get("/blog", userController.loadBlog);
userRoute.get("/checkout", authMiddleware.userAuth, userController.loadCheckout);
userRoute.get("/contact", userController.loadContact);

userRoute.get("/login", authMiddleware.isAlreadyLoggedIn ,authMiddleware.userLoggedOut, authenticationController.loadUserLogin);
userRoute.get("/register", authMiddleware.userLoggedOut, authenticationController.loadUserRegister);
userRoute.post("/register", authMiddleware.userLoggedOut, authenticationController.enterUserDetails);
userRoute.post("/login", authMiddleware.userLoggedOut, authenticationController.doUserLogin);
userRoute.post("/send-otp", authMiddleware.userLoggedOut, authenticationController.doVerfiyOtp);
// userRoute.get("/enter-otp", authMiddleware.userLoggedOut, authenticationController.loadVerifyOTP);
userRoute.get("/logout", authMiddleware.userAuth, authenticationController.doUserLogout);

module.exports = userRoute;
