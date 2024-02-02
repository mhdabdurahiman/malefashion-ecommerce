const Category = require('../models/categoryModel')

const loadCategory = async (req, res) => {
    try {
        const categoryList = await Category.find();
        console.log(categoryList)
        res.render(
            'adminCategory',{
                page_name: 'category',
                categoryList: categoryList
            }
            )
    } catch (error) {
        console.log(error.message);
    }
}

const addCategory = async (req, res) => {
    try {
        const {
            categoryName,
            categoryDescription
        } = req.body;
        
        const existingCategory = await Category.findOne({ name: categoryName});
        if(existingCategory){
            res.render('adminCategory',{message: "Category already exist"})
        } else {
            const category = new Category({
                name: categoryName,
                description: categoryDescription
            })

            const categoryData = await category.save();
            res.redirect('/admin/category')
        } 
    } catch (error) {
        console.log(error.message);
    }
}

const doListCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = await Category.findById( categoryId );
        await categoryData.updateOne( {$set: { isList : true }})
        res.json( { success: true} ) 
    } catch (error) {
        console.log(error.message);
    }
}

const doUnlistCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = await Category.findById( categoryId );
        await categoryData.updateOne( {$set: { isList : false }})
        res.json( { success: true} ) 
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.deleteOne({ _id:categoryId });
        res.json({success:true})
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadCategory,
    addCategory,
    doListCategory,
    doUnlistCategory,
    deleteCategory,
}