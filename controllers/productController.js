const fs = require("fs");
const path = require("path");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { render } = require("ejs");

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

const doListProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById( productId );
    await productData.updateOne( {$set: { isList : true } } );
    res.json( {success:true} )
  } catch (error) {
    console.log(error.message);
  }
}

const doUnlistProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById( productId );
    await productData.updateOne( {$set: { isList : false } } )
    res.json( {success:true} )
  } catch (error) {
      console.log(error.message)
  }
}

const loadEditProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = await Product.findById( productId ).populate('category').exec();
    const categoryList = await Category.find({ isList:true })
    res.render('adminEditProduct', {product:productData, categories:categoryList})
  } catch (error) {
    console.log(error.message)
  }
}


const doEditProduct = async (req, res) => {
  try {
    const productData = await Product.findById( req.body.productId );
    
  } catch (error) {
    console.log(error.message)
  }
}

const doDeleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.deleteOne({ _id:productId });
    res.json({success:true})
  } catch (error) {
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

