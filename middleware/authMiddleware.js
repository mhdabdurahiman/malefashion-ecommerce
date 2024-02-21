const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// function verifyToken(req, res, next) {
//   console.log("entered veryifyToken middleware");
//   console.log(req.cookies);
//   const token = req.cookies.jwt;
//   console.log(token);

//   if (!token) {
//     return res.redirect("/login")
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// function adminLoggedIn

// module.exports = verifyToken;

// authMiddleware.js


module.exports = {
  userAuth: (req, res, next) => {
    const token = req.session.token;


    if (!token) {
      return res.redirect('/login');
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = {
        userId: decoded.userId,
        // other user properties
      };

      next();
    } catch (error) {
      if(error.name === 'TokenExpiredError') {
        return res.status(401).redirect('/login');
      }
      else {
        console.error(error);
        res.status(401).redirect('/login');
      }
    }
  },

  adminAuth: (req, res, next) => {
    const token = req.session.token;

    if (!token) {
      return res.redirect('/admin/login');
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      if (decoded.isAdmin === 1) {
        req.user = {
          userId: decoded.userId,
          // other user properties
        };
        next();
      
      } else {
        return res.redirect('/admin/login')
      }
    } catch (error) {
      if(error.name === 'TokenExpiredError') {
        return res.status(401).redirect('/admin/login');
      }
      else{
        console.error(error);
        res.status(401).redirect('/admin/login')}
    }
  },

  userLoggedOut: (req, res, next) => {
    if (req.session.token) {
      return res.redirect('/');
    }

    next();
  },

  adminLoggedOut: (req, res, next) => {
    if (req.session.token) {
      return res.redirect('/admin/dashboard');
    }

    next();
  },

  isAlreadyLoggedIn: (req, res, next) => {
    if (req.session && req.session.userId) {
      res.redirect('/');
    } else {
      next();
    }
  },

  isAdminAlreadyLoggedIn: (req, res, next) => {
    if (req.session && req.session.adminId) {
      res.redirect('/admin/dashboard');
    } else {
      next();
    }
  }
};

  