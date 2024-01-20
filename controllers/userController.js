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
    loadCart
}