const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const paginationHelper = require("../helpers/paginationHelper");

const loadHome = async (req, res) => {
  try {
    res.render("shop/index");
  } catch (error) {
    console.log(error.message);
  }
};

const loadShop = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const filters = req.query.filters || [];
    const sort =
      req.query.sort === "price_asc"
        ? 1
        : req.query.sort === "price_desc"
        ? -1
        : 1;
    const search = req.query.search || "";
    const limitValue = paginationHelper.SHOP_PRODUCTS_PER_PAGE;
    const skipValue = (page - 1) * limitValue;

    const query = { isList: true };
    if (filters.length > 0) {
      query.category = { $in: filters };
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const totalProducts = await Product.countDocuments(query);

    const productList = await Product.find(query)
      .populate({
        path : 'offer',
        match: {startingDate: {$lte: new Date()}, expiryDate: {$gte: new Date()}}
      })
      .populate({
        path : 'category',
        populate: {
          path : 'offer',
          match: {startingDate: {$lte: new Date()}, expiryDate: {$gte: new Date()}}
        }
      })
      .sort({ price: sort })
      .skip(skipValue)
      .limit(limitValue);
    console.log('productlist:',productList);
    const totalPages = Math.ceil(totalProducts / limitValue);
    const categoryList = await Category.find({ isList: true });
    if (
      req.query.page ||
      req.query.filters ||
      req.query.sort ||
      req.query.search
    ) {
      res.json({
        products: productList,
        categories: categoryList,
        totalPages: totalPages,
        filters: filters,
        sort: sort,
        search: search,
        page: page,
      });
    } else {
      res.render("shop/shop", {
        products: productList,
        categories: categoryList,
        totalPages: totalPages,
        page : page,
      });
    }
  } catch (error) {
    res.status(500).redirect("/error500");
    console.log(error.message);
  }
};

const loadProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path : 'offer',
        match: {startingDate: {$lte: new Date()}, expiryDate: {$gte: new Date()}}
      })
      .populate({
        path: 'category',
        populate: {
          path : 'offer',
          match: {startingDate: {$lte: new Date()}, expiryDate: {$gte: new Date()}}
        }})
      .exec();
    console.log(product);
    res.render("shop/product-details", { product: product });
  } catch (error) {
    res.render("error/error500");
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
  loadProductDetails,
  loadBlog,
  loadAbout,
  loadContact,
};
