const loadError404 = async (req, res) => {
    try {
        res.render('error/error404')
    } catch (error) {
        console.log(error.message)
    }
}

const loadError500 = async (req, res) => {
    try {
        res.render('error/error500')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadError404,
    loadError500
}
