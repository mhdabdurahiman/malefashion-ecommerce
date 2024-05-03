module.exports = function(req, res, next) {
    res.locals = res.locals || {};

    if (req.session.userId){
        res.locals.isAuthenticated = true;
    }else{
        res.locals.isAuthenticated = false;
    }
    next();
}