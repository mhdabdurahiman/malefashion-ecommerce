const Coupon = require("../models/couponModel");

const loadCoupon = async (req, res) => {
  try {
    const couponData = await Coupon.find();
    res.render("admin/adminCoupons", {
      couponData: couponData,
    });
  } catch (error) {
    console.log(error.message)
  }
}

const loadAddCoupon = async (req, res) => {
    try {
      res.render("admin/adminAddCoupon");
    } catch (error) {
      console.log(error.message);
    }
}

const doAddCoupon = async (req, res) => {
  try {
    const {
      minAmount,
      discountType,
      discountAmount,
      maxUses,
      expiryDate
    } = req.body;
    const couponCode = req.body.couponCode.toUpperCase();
    const couponExist = await Coupon.findOne({ name: couponCode });
    if (couponExist) {
      res.status(200).json({ success: false, message: "Coupon already exists" })
    } else {
      const coupon = new Coupon({
        code: couponCode,
        discountType: discountType,
        discountAmount: discountAmount,
        minOrderAmount: minAmount,
        maxUses: maxUses,
        expiresAt: expiryDate
      });
      await coupon.save();
      res.status(200).json({ success: true, message: "Coupon added successfully" })
    }
  } catch (error) {
    console.log(error.message);
  }
}

const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
    await Coupon.deleteOne({ _id: couponId });
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.log(error.message);
  }
}

  module.exports = {
    loadCoupon,
    loadAddCoupon,
    doAddCoupon,
    deleteCoupon,
  }
