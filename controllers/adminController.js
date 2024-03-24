const User = require("../models/userModel");
const paginationHelper = require("../helpers/paginationHelper");


const loadAdminDashboard = async (req, res) => {
    try {
        res.render(
            "admin/adminDashboard",
            {page_name: 'dashboard'})
    } catch (error) {
        console.log(error.message);
    }
};

const loadUserList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const totalUsers = await User.countDocuments();
        const limitValue = paginationHelper.USERS_PER_PAGE;
        const skipValue = (page - 1) * limitValue;
        const totalPages = Math.ceil(totalUsers / limitValue);
        const userList = await User.find( {isAdmin: 0} )
            .sort({ createdDate: -1 })
            .skip(skipValue)
            .limit(limitValue);
        if (req.query.page){
            res.json({
                users: userList,
                page: page,
                totalPages: totalPages,
            })
        } else {
            res.render("admin/adminUserList",{
                userList : userList,
                page: page,
                totalPages: totalPages,
            })
        }
    } catch (error) {
        console.log(error.message)
    }
};

const doBlockUser = async (req, res) => {
    console.log("params id:",req.params['id'])
    try {
        const userId = req.params.id;
        const userData = await User.findById( userId );
        await userData.updateOne({ $set : { isBlocked : true }});
        
        if (req.session.userId === userId){
            delete req.session.userId;
            delete req.session.token
            
        }
        const sessions = req.sessionStore.sessions;
            for ( const sessionId in sessions ) {
            const session = JSON.parse( sessions[sessionId] );
            if ( session.user === userId ) {
                delete sessions[sessionId];
                break; 
            }
            }
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
        await userData.updateOne({ $set : { isBlocked : false }})
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