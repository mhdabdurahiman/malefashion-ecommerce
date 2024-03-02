const User = require( '../models/userModel' )

const checkIsBlocked = async(req, res, next) => {
    try {
        userId = req.session.userId;
        userData = await User.findOne({_id: userId});
        isBlocked = userData.isBlocked;
        if(isBlocked){
            delete req.session.userId;
            delete req.session.token;
            res.redirect('/login')
        }else{
            next()
        }

    } catch (error) {
        console.log(error.message)
    }
    
}

module.exports = 
    {checkIsBlocked};