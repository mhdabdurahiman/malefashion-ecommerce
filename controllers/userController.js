
const loadIndex = async(req,res) =>{
    try {
        res.render('index')
    } catch (error) {
        console.log(error.message)
    }
}

const loadShop = async(req,res) =>{
    try {
        res.render('shop')
    } catch (error) {
        console.log(error.message)
    }
}

const loadBlog = async(req,res) =>{
    try {
        res.render('blog')
    } catch (error) {
        console.log(error.message)
    }
}

const loadAbout = async(req,res) =>{
    try {
        res.render('about')
    } catch (error) {
        console.log(error.message)
    }
}

const loadContact = async(req,res) =>{
    try {
        res.render('contact')
    } catch (error) {
        console.log(error.message)
    }
}

const loadCheckout = async(req,res) =>{
    try {
        res.render('checkout')
    } catch (error) {
        console.log(error.message)
    }
}

const loadCart = async(req,res) =>{
    try {
        res.render('shopping-cart')
    } catch (error) {
        console.log(error.message)
    }
}

const loadProductDetails = async(req,res) =>{
    try {
        res.render('product-details')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadIndex,
    loadShop,
    loadAbout,
    loadBlog,
    loadCheckout,
    loadContact,
    loadProductDetails,
    loadCart
}