const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const otpCreation = require("../utils/otpCreation");
const OTP = require("../models/otpModel");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error while hashing password");
  }
};

const loadUserLogin = async (req, res) => {
  try {
    res.render("auth/login");
  } catch (error) {
    console.log(error.message);
  }
};

const loadUserRegister = async (req, res) => {
  try {
    res.render("auth/register");
  } catch (error) {
    console.log(error.message);
  }
};

// Enter user details function.
// Whenever user enters infomation for registration, otp generates and send to the email given by user at the time of registration.

const enterUserDetails = async (req, res) => {
  try {
    const { fullname, email, mobile, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.json({ existUser: true });
    } else {
      const spassword = await securePassword(password);

      const otpbody = await otpCreation(req, res);
      console.log(otpbody);

      res.render("auth/enterotp", {
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

const doResendOtp = async (req, res) => {
  try {
    const otpbody = await otpCreation(req, res);
  } catch (error) {
    console.log(error.message);
  }
};

//OTP verification and User data save to the database.
// The user data will only be saved whenever the otp is verified

const doVerfiyRegisterOtp = async (req, res) => {
  console.log("Entered into verifyotp function");
  try {
    const { otp, fullname, email, mobile, password } = req.body;
    console.log(otp);

    const response = await OTP.find({ otp }).sort({ createdAt: -1 }).limit(1);
    console.log("email response", response);
    if (response.length === 0 || otp !== response[0].otp) {
      console.log("OTP Error");
      return res.render("auth/enterotp", {
        message: "The OTP is not valid",
        fullname,
        email,
        mobile,
        password,
      });
    } else {
      const user = new User({
        fullname: fullname,
        email: email,
        mobile: mobile,
        password: password,
      });

      const userData = await user.save();
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// User login

const doUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res
        .status(401)
        .render("auth/login", { message: "Authentication failed" });
    }
    if (userData.isBlocked === false) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .render("auth/login", { message: "authentication failed" });
      }
      const token = jwt.sign(
        { userId: userData._id },
        process.env.TOKEN_SECRET,
        { expiresIn: "7200s" }
      );
      req.session.token = token;
      req.session.userId = userData._id;
      res.redirect("/");
    } else {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        return res.render("auth/login", { message: "Account is blocked" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).render("auth/login", { message: "Login failed" });
  }
};

// Logout functionality

const doUserLogout = async (req, res) => {
  try {
    req.session.token = null;
    req.session.userId = null;
    res.redirect("/login");
  } catch (error) {
    console.log(error.message);
  }
};

const loadVerifyOTP = async (req, res) => {
  try {
    res.render("auth/enterotp");
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  console.log("reset password request body:",req.body)
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const spassword = await securePassword(newPassword);

    user.password = spassword;
    const passwordChange = await user.save();
    if(passwordChange){
      return res.status(200).json({ message: "Password reset successful" });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const loadAdminLogin = async (req, res) => {
  try {
    res.render("auth/adminLogin");
  } catch (error) {
    console.log(error.message);
  }
};

const doAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminData = await User.findOne({ email });

    if (adminData && adminData.isAdmin == 1) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);

      if (passwordMatch) {
        console.log("isAdmin:", adminData.isAdmin);
        const token = jwt.sign(
          { userId: adminData._id, isAdmin: adminData.isAdmin },
          process.env.TOKEN_SECRET,
          { expiresIn: "7200s" }
        );

        req.session.adminToken = token;
        req.session.adminId = adminData._id;
        res.redirect("/admin/dashboard");
      } else {
        res.render("auth/adminLogin", {
          err: "Incorrect Email or Password",
        });
      }
    } else {
      res.render("auth/adminLogin", {
        err: "Incorrect Email or Password",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};

const doAdminLogout = async (req, res) => {
  try {
    req.session.adminToken = null;
    req.session.adminId = null;
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
};

const loadForgotPasswordEmailInput = async (req, res) => {
  try {
    res.render("auth/enterEmail");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyForgotPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).json({ message: "Email not found" });
    } else {
      const otpbody = await otpCreation(req, res);
      console.log(otpbody);
      return res.render("auth/forgotpasswordenterotp", { email: email });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const doVerifyForgotPasswordOtp = async (req, res) => {
  console.log("Entered into verifyotp function");
  try {
    console.log("request body:", req.body)
    const { email, otp } = req.body;
    console.log(otp);

    const response = await OTP.find({ otp }).sort({ createdAt: -1 }).limit(1);
    console.log("email response", response);
    if (response.length === 0 || otp !== response[0].otp) {
      console.log("OTP Error");
      return res.render("auth/forgotpasswordenterotp", {
        message: "The OTP is not valid",
        email,
      });
    } else {
      res.render("auth/resetforgotpassword", {email:email})
    }
  } catch (error) {
    console.log(error.message);
  }
};

const doResetForgotPassword = async (req, res) => {
  const {email ,newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findOne({email});

    if (newPassword !== confirmNewPassword) {
      return res.status(400).render('auth/resetforgotpassword', {message: "New password and confirm password doesn't match"})
    }

    const spassword = await securePassword(newPassword);

    user.password = spassword;
    await user.save();

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};




module.exports = {
  loadUserLogin,
  loadUserRegister,
  enterUserDetails,
  doVerfiyRegisterOtp,
  doResendOtp,
  doUserLogin,
  doUserLogout,
  loadVerifyOTP,
  loadAdminLogin,
  doAdminLogin,
  doAdminLogout,
  resetPassword,
  loadForgotPasswordEmailInput,
  verifyForgotPasswordEmail,
  doVerifyForgotPasswordOtp,
  doResetForgotPassword,
};
