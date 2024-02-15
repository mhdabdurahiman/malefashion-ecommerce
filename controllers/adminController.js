const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const loadAdminDashboard = async (req, res) => {
    try {
        res.render(
            "adminDashboard",
            {page_name: 'dashboard'})
    } catch (error) {
        console.log(error.message);
    }
};

const loadUserList = async (req, res) => {
    try {
        const userList = await User.find( {isAdmin: 0} )
        res.render("adminUserList",{
            page_name : 'usermanagement',
            userList : userList,
        })
    } catch (error) {
        console.log(error.message)
    }
};

const doBlockUser = async (req, res) => {
    console.log("params id:",req.params['id'])
    try {
        console.log("entered into block funcion");
        const userId = req.params.id;
        console.log(userId);
        const userData = await User.findById( userId );
        await userData.updateOne({ $set : { is_blocked : true }})
        res.json( { success: true} )
    } catch (error) {
        console.log(error.message)
    }
}

const doUnblockUser = async (req, res) => {
    
    try {

        const userId = req.params.id;
        console.log(userId);
        const userData = await User.findById( userId );
        await userData.updateOne({ $set : { is_blocked : false }})
        res.json( { success: true} )
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadAdminDashboard,
    loadUserList,
    doBlockUser,
    doUnblockUser,
};