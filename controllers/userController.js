const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
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

const LoadHome = async (req, res) => {
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

// Registering new user

const doUserRegister = async (req, res) => {
  try {
    const email = req.body.email;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.json({ existUser: true });
    } else {
      const spassword = await securePassword(req.body.password);
      const userData = new User({
        fullname: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        password: spassword,
      });
      const userSave = await userData.save();
      if (userSave) {
        console.log("Data saved to database successfully");
        res.json({ success: true, message: "User registered successfully"})
      } else {
        console.log("Data not saved");
      }
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
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
  LoadHome,
  loadUserLogin,
  loadUserRegister,
  loadShop,
  loadAbout,
  loadBlog,
  loadCheckout,
  loadContact,
  loadProductDetails,
  loadCart,
  doUserRegister,
  doUserLogin,
  doUserLogout,
  loadVerifyOTP,
};
