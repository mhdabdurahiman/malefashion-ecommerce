const Cart = require("../models/cartModel");

const fetchCartCount = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        if(!userId) {
            res.locals.cartCount = 0;
            return next();
        }

        const cart = await Cart.find({userId: userId})
        
        let totalItems = 0;
        cart[0].items.forEach((item) => {
            totalItems += item.quantity
        });
        console.log("totalItems:", totalItems);
        res.locals.cartCount = totalItems;
        next();
    } catch (error) {
        console.error('Error fetching cart count: ', error);
        res.locals.cartCount = 0;
        next();
    }
};

module.exports = fetchCartCount;