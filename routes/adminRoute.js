const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
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

// Authentication
adminRoute.get("/login", authMiddleware.adminLoggedOut, adminController.loadAdminLogin);
adminRoute.get("/logout",  adminController.doAdminLogout);
adminRoute.post("/login", authMiddleware.adminLoggedOut, adminController.doAdminLogin);

// Dashboard
adminRoute.get("/dashboard", authMiddleware.adminAuth, adminController.loadAdminDashboard);

// Userlist-block-unblock
adminRoute.get("/userlist", authMiddleware.adminAuth, adminController.loadUserList);
adminRoute.patch("/blockuser/:id", authMiddleware.adminAuth, adminController.doBlockUser);
adminRoute.patch("/unblockuser/:id", authMiddleware.adminAuth, adminController.doUnblockUser);

// Category-mangement
adminRoute.get("/category", authMiddleware.adminAuth, categoryController.loadCategory);
adminRoute.post("/add-category", authMiddleware.adminAuth, categoryController.addCategory);
adminRoute.patch("/list-category/:id", authMiddleware.adminAuth, categoryController.doListCategory);
adminRoute.patch("/unlist-category/:id", authMiddleware.adminAuth, categoryController.doUnlistCategory);
adminRoute.delete("/delete-category/:id", authMiddleware.adminAuth, categoryController.deleteCategory);

module.exports = adminRoute;
