const Coupon = require( '../models/couponModel' )

module.exports = {
    discountPrice: async (couponId, cartTotal) => {
        const coupon = await Coupon.findById(couponId);
        if(!coupon){
            return {
                discountAmount: 0,
                discountedTotal: cartTotal
            };
        }
        let discountAmount = 0;
        if (coupon.discountType === 'percent') {
            discountAmount = (coupon.discountAmount/100)*cartTotal;
        } else if (coupon.discountType === 'fixed') {
            discountAmount = coupon.discountAmount;
        }
        const discountedTotal = cartTotal - discountAmount;
        return { discountAmount, discountedTotal }
    }
}