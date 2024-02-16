const Product = require ( '../models/productModel' );
const Category = require ( '../models/categoryModel' );
const User = require ('../models/userModel');

const loadHome = async (req, res) => {
    try {
      res.render("shop/index");
    } catch (error) {
      console.log(error.message);
    }
  };

const loadShop = async (req, res) => {
    try {
      const productList = await Product.find({isList:true});
      const categoryList = await Category.find({isList:true});
      res.render("shop/shop",{Products: productList, Categories: categoryList});
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadProductDetails = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category').exec();
      console.log(product)
      res.render("shop/product-details",{product: product});
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCheckout = async (req, res) => {
    try {
      res.render("shop/checkout");
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadBlog = async (req, res) => {
    try {
      res.render("shop/blog");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const loadAbout = async (req, res) => {
    try {
      res.render("shop/about");
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const loadContact = async (req, res) => {
    try {
      res.render("shop/contact");
    } catch (error) {
      console.log(error.message);
    }
  };

  module.exports = {
    loadHome,
    loadShop,
    loadCheckout,
    loadProductDetails,
    loadBlog,
    loadAbout,
    loadContact,
  };