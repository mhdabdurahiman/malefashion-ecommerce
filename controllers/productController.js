const fs = require("fs");
const path = require("path");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const loadProductList = async (req, res) => {
  try {
    const productList = await Product.find({});
    console.log(productList);
    res.render("adminProductList", { products: productList });
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddProducts = async (req, res) => {
  try {
    const categoryList = await Category.find({ isList: true });
    console.log(categoryList);
    res.render("adminAddProduct", { categories: categoryList });
  } catch (error) {
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
    console.log(error.message);
  }
};

const doDeleteProducts = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadProductList,
  loadAddProducts,
  doAddProducts,
  doDeleteProducts,
};

