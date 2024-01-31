const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const loadAdminLogin = async (req, res) => {
    try {
        res.render("adminLogin")
    } catch (error) {
        console.log(error.message);
    }
};

const loadAdminDashboard = async (req, res) => {
    try {
        res.render("adminDashboard")
    } catch (error) {
        console.log(error.message);
    }
};

// const doAdminLogin = async (req, res) => {
//     try {
//         const {email, password} = req.body
//         const adminData = await User.findOne({ email })
//         if( adminData && adminData.isAdmin == 1 ) {
//             const passwordMatch = await bcrypt.compare( password, adminData.password )
//             if( passwordMatch ){
//                 console.log("isAdmin:", adminData.isAdmin)
//                 const token = jwt.sign( {userId: adminData._id, isAdmin:adminData.isAdmin} , 
//                     process.env.TOKEN_SECRET, 
//                     {expiresIn: "3600s",}
//                     );
//                   res.cookie("jwt", token, {
//                     httpOnly: true,
//                     maxAge: 24 * 60 * 60 * 1000, // ms
//                   });
//                   res.redirect('/admin/dashboard');
//             } 
//             else {
//                 res.render('adminLogin', {
//                     err: 'Incorrect Email or Password'
//                 }) ;
//             }
//         }
//          else 
//          {
//             res.render('adminLogin', {
//                 err: 'Incorrect Email or Password'
//             })
//         }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

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
                    { expiresIn: "3600s" }
                );

                res.cookie("jwt", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // ms
                });

                res.redirect('/admin/dashboard');
            } else {
                res.render('adminLogin', {
                    err: 'Incorrect Email or Password'
                });
            }
        } else {
            res.render('adminLogin', {
                err: 'Incorrect Email or Password'
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Login failed' });  // Send an error response in case of an exception
    }
};

const doAdminLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.redirect("/admin/login");
      } catch (error) {
        console.log(error.message);
      }
};

module.exports = {
    loadAdminLogin,
    loadAdminDashboard,
    doAdminLogin,
    doAdminLogout,
};