const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { startOfMonth, endOfMonth } = require('date-fns');

const totalRevenue = async () => {
    const revenue = await Order.aggregate([
        {
            $match:{
                orderStatus:{
                    $eq: "Delivered"
                } 
            }
        },
        {
            $group:{
                _id: null,
                revenue:{
                    $sum : "$totalPrice"
                }
            }
        }
    ])

    const totalRevenue = revenue.length > 0 ? revenue[0].revenue : 0;
    return totalRevenue
}

const amountPerPaymentMethod = async () => {
    const totalAmountPerPaymentMethod = await Order.aggregate([
        {
            $match:
            {
                paymentStatus:{
                    $eq: "Completed"
                }
            }
        },
        {
            $group:{
                _id: "$paymentOption",
                amount:{
                    $sum: "$totalPrice"
                }
            }
        }
    ])
    const result = totalAmountPerPaymentMethod.length > 0 ? totalAmountPerPaymentMethod : 0;
    return result
}

const productCategoryDistribution = async () => {
    const categoryProductCount = await Product.aggregate([
        {$group: {
            _id: '$category', count:{ $sum: 1}
        }}
    ]);
    const categoryData = await Category.populate(categoryProductCount, {path: '_id', select: 'name'});
    return categoryData;
}

const numberOfOrders = async () => {
    const totalOrderCount = await Order.countDocuments()
    return totalOrderCount;
}

const productCount = async () => {
    return await Product.countDocuments({isDeleted: false, isList: true})
}

const monthlyEarning = async () => {
    const currentDate = new Date();
    const startOfMonthDate = startOfMonth(currentDate);
    const endOfMonthDate = endOfMonth(currentDate);
    let currentMonthEarnings = 0

    Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfMonthDate,
                    $lt: endOfMonthDate
                },
                orderStatus: "Delivered"
            },
           
        },
        {
            $group: {
                _id: null,
                totalSales: {$sum: '$totalPrice'}
            }
        }
    ])
    .then(results => {
        console.log('results array',results);
        currentMonthEarnings = results.length > 0 ? results[0].totalSales : 0;
    })
    .catch(error => {
        console.error('Error calculating current month earnings:', error);
    });
    return currentMonthEarnings;
}

const topTen = async () => {
    const topSellingProducts = await Order.aggregate([
        { $unwind: '$products'},
        {
            $lookup: {
              from: 'products',
              localField: 'products.productId',
              foreignField: '_id',
              as: 'productDetails'
            }
          },
          { $unwind: '$productDetails' },
        {
            $group: {
                _id: '$productDetails._id',
                productName: {$first:'$productDetails.name'},
                totalQuantity: { $sum: '$products.quantity'}
            }
        },
        { $sort: { totalQuantity: -1}},
        { $limit: 10 }
    ]);

    const topSellingCategories = await Order.aggregate([
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        {
            $lookup: {
                from: 'categories',
                localField: 'productDetails.category',
                foreignField: '_id',
                as: 'categoryDetails'
            }
        },
        { $unwind: '$categoryDetails'},
        {
          $group: {
            _id: '$categoryDetails._id',
            categoryName:  { $first:'$categoryDetails.name'},
            totalQuantity: { $sum: '$products.quantity' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
      ]);
      
      const topSellingBrands = await Order.aggregate([
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        {
          $group: {
            _id: '$productDetails.brand',
            brandName: { $first: '$productDetails.brand' },
            totalQuantity: { $sum: '$products.quantity' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
      ]);

      return {
        topSellingProducts: topSellingProducts,
        topSellingCategories: topSellingCategories,
        topSellingBrands: topSellingBrands,
      }
}

module.exports = {
    totalRevenue,
    amountPerPaymentMethod,
    productCategoryDistribution,
    numberOfOrders,
    productCount,
    monthlyEarning,
    topTen,
}