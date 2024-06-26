const Category = require("../models/categoryModel");
const Offer = require("../models/offerModel");

const loadCategory = async (req, res) => {
  try {
    const categoryList = await Category.find().populate('offer');
    console.log("categories after populating offer: ",categoryList)
    const offers = await Offer.find();
    res.render("admin/adminCategory", {
      page_name: "category",
      categoryList: categoryList,
      offers: offers
    });
  } catch (error) {
    console.log(error.message);
  }
};

const doAddCategory = async (req, res) => {
  try {
    console.log("Called do Add category");
    const categoryDescription = req.body.categoryDescription.trim();

    const categoryName = req.body.categoryName.toLowerCase();

    const existingCategory = await Category.findOne({ name: categoryName });
    if (existingCategory) {
      res
        .status(200)
        .json({ success: false, message: "Category already exists" });
    } else {
      const category = new Category({
        name: categoryName,
        description: categoryDescription,
      });

      const categoryData = await category.save();
      res
        .status(200)
        .json({ success: true, message: "Category added successfully" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const doListCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = await Category.findById(categoryId);
    await categoryData.updateOne({ $set: { isList: true } });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
};

const doUnlistCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = await Category.findById(categoryId);
    await categoryData.updateOne({ $set: { isList: false } });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const CategoryData = await Category.findById(categoryId);
    res.render("admin/adminEditCategory", {
      category: CategoryData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const doEditCategory = async (req, res) => {
  try {
    console.log("edit category request body: ", req.body);
    const { categoryId } = req.body;
    const categoryName = req.body.categoryName.toLowerCase();
    const categoryDescription = req.body.categoryDescription.trim();


    const categoryData = await Category.findById(categoryId);
    const existingCategory = await Category.findOne({ name: categoryName });

    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      console.log("Category with same name already exists");
      return res.json({
        success: false,
        message: "Category with same name already exists",
      });
    } else {
      console.log("Success");
      await categoryData.updateOne({
        $set: { name: categoryName, description: categoryDescription },
      });
      console.log("Category updated successfully");
      return res.json({
        success: true,
        message: "Category updated successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const doDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    await Category.deleteOne({ _id: categoryId });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadCategory,
  doAddCategory,
  doListCategory,
  doUnlistCategory,
  doDeleteCategory,
  loadEditCategory,
  doEditCategory,
};
