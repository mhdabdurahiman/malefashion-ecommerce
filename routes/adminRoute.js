const authenticationController = require("../controllers/authenticationController")
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const cookieParser = require("cookie-parser");
const upload = require( "../middleware/multer" )



const express = require("express");
const path = require("path");
const adminRoute = express();

adminRoute.set("view engine", "ejs");
adminRoute.set("views", path.join(__dirname, "../views/admin"));

const bodyParser = require("body-parser");
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({ extended: true }));
adminRoute.use(cookieParser());

// Authentication-routes
adminRoute.get("/login", authMiddleware.isAdminAlreadyLoggedIn ,authMiddleware.adminLoggedOut, authenticationController.loadAdminLogin);
adminRoute.get("/logout",  authenticationController.doAdminLogout);
adminRoute.post("/login", authMiddleware.adminLoggedOut, authenticationController.doAdminLogin);

// Dashboard
adminRoute.get("/dashboard", authMiddleware.adminAuth, adminController.loadAdminDashboard);

// Userlist-block-unblock-routes
adminRoute.get("/userlist", authMiddleware.adminAuth, adminController.loadUserList);
adminRoute.patch("/blockuser/:id", authMiddleware.adminAuth, adminController.doBlockUser);
adminRoute.patch("/unblockuser/:id", authMiddleware.adminAuth, adminController.doUnblockUser);

// Category-management-routes
adminRoute.get("/category", authMiddleware.adminAuth, categoryController.loadCategory);
adminRoute.post("/add-category", authMiddleware.adminAuth, categoryController.doAddCategory);
adminRoute.patch("/list-category/:id", authMiddleware.adminAuth, categoryController.doListCategory);
adminRoute.patch("/unlist-category/:id", authMiddleware.adminAuth, categoryController.doUnlistCategory);
adminRoute.delete("/delete-category/:id", authMiddleware.adminAuth, categoryController.doDeleteCategory);
adminRoute.get("/edit-category/:id", authMiddleware.adminAuth, categoryController.loadEditCategory); 
adminRoute.post("/edit-category", authMiddleware.adminAuth, categoryController.doEditCategory)

// Product-management-routes
adminRoute.get( '/products', authMiddleware.adminAuth, productController.loadProductList);
adminRoute.get( '/add-product', authMiddleware.adminAuth, productController.loadAddProducts);
adminRoute.post( '/add-product', authMiddleware.adminAuth, upload.array('images',4), productController.doAddProducts);
adminRoute.get( '/edit-product/:id', authMiddleware.adminAuth, productController.loadEditProduct );
adminRoute.patch( '/list-product/:id', authMiddleware.adminAuth, productController.doListProduct);
adminRoute.patch( '/unlist-product/:id', authMiddleware.adminAuth, productController.doUnlistProduct );
adminRoute.delete( '/delete-product/:id', authMiddleware.adminAuth, productController.doDeleteProducts);


module.exports = adminRoute;
