const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const cookieParser = require("cookie-parser");


const express = require("express");
const path = require("path");
const adminRoute = express();

adminRoute.set("view engine", "ejs");
adminRoute.set("views", path.join(__dirname, "../views/admin"));

const bodyParser = require("body-parser");
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));
adminRoute.use(cookieParser());

adminRoute.get("/login", authMiddleware.adminLoggedOut, adminController.loadAdminLogin);
adminRoute.get("/logout",  adminController.doAdminLogout);
adminRoute.post("/login", authMiddleware.adminLoggedOut, adminController.doAdminLogin);

adminRoute.get("/dashboard", authMiddleware.adminAuth, adminController.loadAdminDashboard);
adminRoute.get("/userlist", authMiddleware.adminAuth, adminController.loadUserList);
adminRoute.patch("/blockuser/:id", authMiddleware.adminAuth, adminController.doBlockUser);
adminRoute.patch("/unblockuser/:id", authMiddleware.adminAuth, adminController.doUnblockUser);

module.exports = adminRoute;
