const fs = require("fs");
const path = require("path");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Offer = require("../models/offerModel");
const paginationHelper = require("../helpers/paginationHelper");

// admin product control functions

const loadProductList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalProducts = await Product.countDocuments();
    const limitValue = paginationHelper.ADMIN_PRODUCTS_PER_PAGE
    const totalPages = Math.ceil(
      totalProducts / limitValue
    );
    const productList = await Product.find({isDeleted: false})
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
    const productId = req.body.productId
    const productData = await Product.findById(productId);

    const uploadedImages = req.files ? req.files.map(file => file.filename) : [];
    console.log('uploaded images: ', uploadedImages);

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      size: req.body.size,
      category: req.body.categoryId,
      stock: req.body.stock,
      price: req.body.price,
    };
    const productData1 = await Product.findById(productId)
      .populate("category")
      .exec();
    const categoryList = await Category.find({ isList: true });

    if (uploadedImages.length > 0) {
      updatedData.image = [...productData.image, ...uploadedImages];
      if(updatedData.image.length > 4){
        return res.render("admin/adminEditProduct", {
          product: productData1,
          categories: categoryList, 
          errorMessage: 'Maximum 4 images are only allowed'
        });
      }
    }

    await Product.updateOne({ _id: productId }, { $set: updatedData });
    
      res.redirect("/admin/products");
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const productId = req.body.productId;
    const image = req.body.image;

    console.log(productId, image)

    await Product.updateOne({ _id: productId }, {$pull: {image: image}});
    res.status(200).json({success: true, message: 'Image deleted successfully'})
  } catch (error) {
    console.error('Error deleting image:', error);
    res.render("error/error500");
  }
}

const doDeleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.updateOne({ _id: productId }, {$set: {isDeleted: true}});
    res.json({ success: true });
  } catch (error) {
    res.render("error/error500");
    console.log(error.message);
  }
};

const loadArchivedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalProducts = await Product.countDocuments({isDeleted: true});
    const limitValue = paginationHelper.ADMIN_PRODUCTS_PER_PAGE
    const totalPages = Math.ceil(
      totalProducts / limitValue
    );
    const archivedProductList = await Product.find({isDeleted: true})
      .skip((page - 1)*limitValue)
      .limit(limitValue);
    if(req.query.page){
      res.json({
        products: archivedProductList,
        page: page,
        totalPages: totalPages,
      })
    } else {
      res.render("admin/adminArchivedProducts", {
        products: archivedProductList,
        page: page,
        totalPages: totalPages,
      })
    }
  } catch (error) {
    res.redirect("/error500");
    console.log(error.message);
  }
}

const doUnarchiveProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.updateOne({ _id: productId }, {$set: {isDeleted: false}});
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
  deleteProductImage,
  doDeleteProducts,
  loadArchivedProducts,
  doUnarchiveProduct,
};
