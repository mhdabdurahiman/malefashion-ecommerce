const Cart = require('../models/cartModel');
const mongoose = require('mongoose');

module.exports = {
  totalCartPrice: async (user) => 
    {

      try {
          const totalPrice = await Cart.aggregate([
            {
              $match: { userId: new mongoose.Types.ObjectId(user) }
            },
            {
              $unwind: "$items"
            },
            {
              $lookup: {
                from: "products",
                localField: "items.productId",
                foreignField: "_id",
                as: "product"
              }
            },
            {
              $unwind: "$product"
            },
            {
              $lookup: {
                from: "offers",
                localField: "product.offer",
                foreignField: "_id",
                as: "productOffer"
              }
            },
            {
              $unwind: {
                path: "$productOffer",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $lookup: {
                from: "categories",
                let: { categoryId: "$product.category" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$categoryId"] }
                    }
                  },
                  {
                    $lookup: {
                      from: "offers",
                      localField: "offer",
                      foreignField: "_id",
                      as: "categoryOffer"
                    }
                  },
                  {
                    $unwind: {
                      path: "$categoryOffer",
                      preserveNullAndEmptyArrays: true
                    }
                  }
                ],
                as: "category"
              }
            },
            {
              $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $addFields: {
                appliedOffer: {
                  $cond: {
                    if: { $ifNull: ["$productOffer", false] },
                    then: "$productOffer",
                    else: "$categoryOffer"
                  }
                }
              }
            },
            {
              $addFields: {
                totalPricePerItem: {
                  $multiply: [
                    "$product.price",
                    {
                      $subtract: [1, { $divide: [{ $ifNull: ["$appliedOffer.percentage", 0] }, 100] }]
                    }
                  ]
                }
              }
            },
            {
              $addFields: {
                totalPricePerItem: { $trunc: "$totalPricePerItem" }
              }
            },
            {
              $group: {
                _id: "$_id",
                userId: { $first: "$userId" },
                items: {
                  $push: {
                    _id: "$items._id",
                    productId: "$items.productId",
                    productName: "$product.name",
                    quantity: "$items.quantity",
                    appliedOffer: "$appliedOffer",
                    totalPrice: "$totalPricePerItem" 
                  }
                },
                total: { $sum: { $multiply: ["$totalPricePerItem", "$items.quantity"] } } 
              }
            }
          ]);
          return totalPrice

      } catch (error) {
        res.redirect('/error500')

      }
  }

}
