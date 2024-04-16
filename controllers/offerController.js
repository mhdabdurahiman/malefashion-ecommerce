const Offer = require("../models/offerModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const loadAdminOffer = async (req, res) => {
  try {
    const offerData = await Offer.find();
    res.render("admin/adminOfferList", {
      offerData: offerData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddOffer = async (req, res) => {
  try {
    res.render("admin/adminAddOffer");
  } catch (error) {
    console.log(error.message);
  }
};

const doAddOffer = async (req, res) => {
  try {
    const { startingDate, expiryDate, percentage } = req.body;
    const offerName = req.body.offerName.toUpperCase();
    const offerExist = await Offer.findOne({ name: offerName });
    if (offerExist) {
      res.status(200).json({ success: false, message: "Offer already exist" });
    } else {
      const offer = new Offer({
        name: offerName,
        startingDate: startingDate,
        expiryDate: expiryDate,
        percentage: percentage,
      });
      await offer.save();
      res.status(200).json({ success: true, message: "Offer added successfully" });}
  } catch (error) {
    console.log(error.message);
  }
};

const deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    await Offer.findByIdAndDelete(offerId);
    res.status(200).json({ success: true, message: "Offer deleted successfully" });
  } catch (error) {
    console.log(error.message);
  }
}

const applyProductOffer = async (req, res) => {
  try {
    const {offerId, productId} = req.body;
    
    const product = await Product.findById(productId);
    product.offer = offerId;
    await product.save();
    res.json( { success: true } );
  } catch (error) {
    console.log(error.message);
  } 
}

const removeProductOffer = async (req, res) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findOneAndUpdate({ _id: productId }, { $unset: { offer: "" } });
    res.json({ success: true });
  } catch (error){
    console.log(error.message)
  }
}

const applyCategoryOffer = async (req, res) => {
  try {
    const {offerId, categoryId} = req.body;
    
    const category = await Category.findById(categoryId);
    category.offer = offerId;
    await category.save();
    res.json( { success: true } );
  } catch (error) {
    console.log(error.message);
  }
}

const removeCategoryOffer = async (req, res) => {
  try {
    const categoryId = req.body.categoryId;
    const category = await Category.findOneAndUpdate({ _id: categoryId }, { $unset: { offer: "" } });
    res.json({ success: true });
  } catch (error){
    console.log(error.message)
  }
}

module.exports = {
  loadAdminOffer,
  loadAddOffer,
  doAddOffer,
  deleteOffer,
  applyProductOffer,
  removeProductOffer,
  applyCategoryOffer,
  removeCategoryOffer,
};
