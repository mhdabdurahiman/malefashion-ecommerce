

const loadCart = (req, res)=> {
    try {
        res.render('shop/shopping-cart')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadCart,
}