const userController = require('../controllers/userController')
const userAuthMiddleware = require('../middleware/userAuthMiddleware')
const cookieParser = require('cookie-parser')

const express = require("express");
const path = require('path')
const userRoute = express();

userRoute.set('view engine','ejs')
userRoute.set('views',path.join(__dirname, '../views/user'))

const bodyParser = require('body-parser');
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({extended:true}))
userRoute.use(cookieParser())


userRoute.get('/',userController.loadIndex)
userRoute.get('/login',userController.loadLogin)
userRoute.get('/register',userController.loadRegister)
userRoute.get('/shop',userController.loadShop)
userRoute.get('/about',userController.loadAbout)
userRoute.get('/cart', userAuthMiddleware,userController.loadCart)
userRoute.get('/product',userAuthMiddleware, userController.loadProductDetails)
userRoute.get('/blog',userController.loadBlog)
userRoute.get('/checkout',userController.loadCheckout)
userRoute.get('/contact',userController.loadContact)

userRoute.post('/register',userController.doRegister)
userRoute.post('/login', userController.doLogin)




module.exports = userRoute;