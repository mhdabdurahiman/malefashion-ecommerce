const authenticationController = require("../controllers/authenticationController")
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const offerController = require("../controllers/offerController");
const couponController = require("../controllers/couponController");
const upload = require( "../middleware/multer" );

const express = require("express");
const adminRoute = express();

// Admin-Authentication-routes
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
adminRoute.post( '/edit-product', authMiddleware.adminAuth, upload.array('images',4),productController.doEditProduct );
adminRoute.delete( '/delete-product-image',  authMiddleware.adminAuth, productController.deleteProductImage);
adminRoute.patch( '/list-product/:id', authMiddleware.adminAuth, productController.doListProduct);
adminRoute.patch( '/unlist-product/:id', authMiddleware.adminAuth, productController.doUnlistProduct );
adminRoute.delete( '/delete-product/:id', authMiddleware.adminAuth, productController.doDeleteProducts);
adminRoute.get( '/archived-products', authMiddleware.adminAuth, productController.loadArchivedProducts );
adminRoute.patch( '/unarchive-product/:id', authMiddleware.adminAuth, productController.doUnarchiveProduct );

// Order-management-routes
adminRoute.get( '/orders', authMiddleware.adminAuth, orderController.loadAdminOrderList);
adminRoute.get( '/order-details/:id', authMiddleware.adminAuth, orderController.loadAdminOrderDetails);
adminRoute.patch( '/change-order-status', authMiddleware.adminAuth, orderController.adminChangeOrderStatus );

// Offer-management-routes
adminRoute.get( '/offers', authMiddleware.adminAuth, offerController.loadAdminOffer);
adminRoute.get( '/add-offer', authMiddleware.adminAuth, offerController.loadAddOffer);
adminRoute.post( '/add-offer', authMiddleware.adminAuth, offerController.doAddOffer);
adminRoute.post( '/apply-product-offer', authMiddleware.adminAuth, offerController.applyProductOffer);
adminRoute.post( '/remove-product-offer', authMiddleware.adminAuth, offerController.removeProductOffer);
adminRoute.post( '/apply-category-offer', authMiddleware.adminAuth, offerController.applyCategoryOffer);
adminRoute.post( '/remove-category-offer', authMiddleware.adminAuth, offerController.removeCategoryOffer);
adminRoute.delete( '/delete-offer/:id' ,authMiddleware.adminAuth, offerController.deleteOffer);

// Coupon-management-routes
adminRoute.get( '/coupons', authMiddleware.adminAuth, couponController.loadCoupon );
adminRoute.get( '/add-coupon', authMiddleware.adminAuth, couponController.loadAddCoupon );
adminRoute.post( '/add-coupon', authMiddleware.adminAuth, couponController.doAddCoupon );
adminRoute.delete( '/delete-coupon/:id', authMiddleware.adminAuth, couponController.deleteCoupon );

// Sales-report-routes
adminRoute.get( '/sales-report', authMiddleware.adminAuth, orderController.loadSalesReport);

module.exports = adminRoute;
