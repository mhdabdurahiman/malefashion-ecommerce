const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const otpCreation = require("../utils/otpCreation");
const OTP = require('../models/otpModel')
require("dotenv").config();

// Hashing password

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error while hashing password");
  }
};

const loadHome = async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error.message);
  }
};

// Enter user details function.
// Whenever user enters infomation for registration, otp generates and send to the email given by user at the time of registration.

const enterUserDetails = async (req, res) => {
  try {
    const {
       fullname,
       email,
       mobile, 
       password} = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.json({ existUser: true });
    } else {
      const spassword = await securePassword(password);

      const otpbody = await otpCreation(req, res);
      console.log(otpbody);

      res.render("enterotp", {
        otpMessage: "OTP Sent to mail",
        fullname: fullname,
        email: email,
        mobile: mobile,
        password: spassword,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//OTP verification and User data save to the database.
// The user data will only be saved whenever the otp is verified

const doVerfiyOtp = async (req, res) => {
  console.log('Entered into verifyotp function');
  try {
    console.log('user:',req.body)
    const {otp,
        fullname,
        email,
        mobile, 
        password} = req.body;
        console.log(otp);

        const response = await OTP.find({otp}).sort({createdAt: -1}).limit(1);
        console.log("email response", response);
        if(response.length === 0 || otp !== response[0].otp) {
          console.log('OTP Error');
          return res.render('enterotp', {message:'The OTP is not valid', fullname, email, mobile, password});
        }
        else{
          console.log('OTP found in Mongo');

          const user = new User({
            fullname: fullname,
            email: email,
            mobile: mobile,
            password: password,
          });
          console.log(user);

          const userData = await user.save();
          console.log(userData);
          res.redirect('/login')
        }
  } catch (error) {
    console.log(error.message);
  }
};

// User login

const doUserLogin = async (req, res) => {
  try {
    console.log("entered into login function");
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: userData._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3600s",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // ms
    });
    res.redirect("cart");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Login failed" });
  }
};

// Logout functionality

const doUserLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const loadVerifyOTP = async (req, res) => {
  try {
    res.render("enterotp");
  } catch (error) {
    console.log(error.message);
  }
};

const loadShop = async (req, res) => {
  try {
    res.render("shop");
  } catch (error) {
    console.log(error.message);
  }
};

const loadBlog = async (req, res) => {
  try {
    res.render("blog");
  } catch (error) {
    console.log(error.message);
  }
};

const loadAbout = async (req, res) => {
  try {
    res.render("about");
  } catch (error) {
    console.log(error.message);
  }
};

const loadContact = async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    console.log(error.message);
  }
};

const loadCheckout = async (req, res) => {
  try {
    res.render("checkout");
  } catch (error) {
    console.log(error.message);
  }
};

const loadCart = async (req, res) => {
  try {
    res.render("shopping-cart");
  } catch (error) {
    console.log(error.message);
  }
};

const loadProductDetails = async (req, res) => {
  try {
    res.render("product-details");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadHome,
  loadUserLogin,
  loadUserRegister,
  loadShop,
  loadAbout,
  loadBlog,
  loadCheckout,
  loadContact,
  loadProductDetails,
  loadCart,
  enterUserDetails,
  doUserLogin,
  doUserLogout,
  doVerfiyOtp,
  loadVerifyOTP,
};
