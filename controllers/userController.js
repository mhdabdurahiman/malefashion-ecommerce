const bcrypt = require('bcrypt')
const User = require('../models/userModel')
require('dotenv').config();

// Hashing password

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message)
        throw new Error("Error while hashing password");
    }
}


const loadIndex = async(req,res) =>{
    try {
        res.render('index')
    } catch (error) {
        console.log(error.message)
    }
}

const loadLogin = async(req,res) =>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}

const loadRegister = async(req,res) =>{
    try {
        res.render('register')
    } catch (error) {
        console.log(error.message)
    }
}

// Registering new user

const doRegister = async(req,res) =>{
    try {
        const email = req.body.email;
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            res.json({ existUser: true});
        }
        else {
            const spassword = await securePassword(req.body.password);
            const userData = new User({
                fullname: req.body.name,
                mobile: req.body.mobile,
                email: req.body.email,
                password: spassword,
            })
            const userSave = await userData.save();
            if (userSave) {
                console.log('Data saved to database successfully');
            }
            else{
                console.log('Data not saved');
            }
        }
        
    } catch (error) {
        console.log(error.message);
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
    loadLogin,
    loadRegister,
    loadShop,
    loadAbout,
    loadBlog,
    loadCheckout,
    loadContact,
    loadProductDetails,
    loadCart,
    doRegister,
}