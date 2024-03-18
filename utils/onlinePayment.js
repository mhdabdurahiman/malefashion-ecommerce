const Razorpay = require('razorpay');

const {RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET} = process.env
const razorpayInstance = new Razorpay({

    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET

});

module.exports = {
    
    razorpayPayment : async(orderId, amount) => {
        let options = {
            amount: amount*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: orderId
          };
          const order = razorpayInstance.orders.create(options)
          return order
    }
   
}

