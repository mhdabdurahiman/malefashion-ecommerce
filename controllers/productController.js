const fs = require("fs");
const path = require("path");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Offer = require("../models/offerModel");
const paginationHelper = require("../helpers/paginationHelper");
const { render } = require("ejs");

// admin product control functions

const loadProductList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalProducts = await Product.countDocuments();
    const limitValue = paginationHelper.ADMIN_PRODUCTS_PER_PAGE
    const totalPages = Math.ceil(
      totalProducts / limitValue
    );
    const productList = await Product.find()
      .skip((page - 1)*limitValue)
      .limit(limitValue)
      .populate("offer");
    const offers = await Offer.find();
    if(req.query.page){
      res.json({
        products: productList,
        page: page,
        totalPages: totalPages,
        offers: offers,
      })
    }else {
      res.render("admin/adminProductList", {
        products: productList,
        totalPages: totalPages,
        offers: offers
      });
    }
    
  } catch (error) {
    res.redirect("/error500");
    console.log(error.message);
  }
};

const loadAddProducts = async (req, res) => {
  try {
    const categoryList = await Category.find({ isList: true });
    res.render("admin/adminAddProduct", { categories: categoryList });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const doAddProducts = async (req, res) => {
  console.log(req.body);
  try {
    const img = [];
    for (let items of req.files) {
      img.push(items.filename);
    }
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      size: req.body.size,
      image: img,
      category: req.body.categoryId,
      stock: req.body.stock,
      price: req.body.price,
    });
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const doListProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId);
    await productData.updateOne({ $set: { isList: true } });
    res.json({ success: true });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const doUnlistProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId);
    await productData.updateOne({ $set: { isList: false } });
    res.json({ success: true });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const loadEditProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById(productId)
      .populate("category")
      .exec();
    const categoryList = await Category.find({ isList: true });
    res.render("admin/adminEditProduct", {
      product: productData,
      categories: categoryList,
    });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const doEditProduct = async (req, res) => {
  try {
    const productData = await Product.findById(req.body.productId);
    console.log(req.files);
    if (req.files) {
      const img = [];
      for (let items of req.files) {
        img.push(items.filename);
      }
      if (img.length > 0) {
        await productData.updateOne({
          $set: {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            size: req.body.size,
            image: img,
            category: req.body.categoryId,
            stock: req.body.stock,
            price: req.body.price,
          },
        });
        res.redirect("/admin/products");
      } else {
        await productData.updateOne({
          $set: {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            size: req.body.size,
            category: req.body.categoryId,
            stock: req.body.stock,
            price: req.body.price,
          },
        });
        res.redirect("/admin/products");
      }
    }
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const doDeleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.deleteOne({ _id: productId });
    res.json({ success: true });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

module.exports = {
  loadProductList,
  loadAddProducts,
  doAddProducts,
  doListProduct,
  doUnlistProduct,
  loadEditProduct,
  doEditProduct,
  doDeleteProducts,
};
