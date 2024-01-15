const userController = require('../controllers/userController')

const express = require("express");
const path = require('path')
const userRoute = express();

userRoute.set('view engine','ejs')
userRoute.set('views',path.join(__dirname, '../views/user'))



userRoute.get('/',userController.loadIndex)
userRoute.get('/shop',userController.loadShop)
userRoute.get('/about',userController.loadAbout)
userRoute.get('/cart',userController.loadCart)
userRoute.get('/product',userController.loadProductDetails)
userRoute.get('/blog',userController.loadBlog)
userRoute.get('/checkout',userController.loadCheckout)
userRoute.get('/contact',userController.loadContact)




module.exports = userRoute;