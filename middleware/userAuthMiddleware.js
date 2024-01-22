const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

function verifyToken(req, res, next) {
    console.log('entered veryifyToken middleware');
    console.log(req.cookies);
    const token = req.cookies.jwt;
    console.log(token);
    
    if (!token) return res.status(401).json({ error:'Access denied'});
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ error: 'Invalid token' });
        
    }
}

module.exports = verifyToken;