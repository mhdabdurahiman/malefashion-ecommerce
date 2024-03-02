const User = require("../models/userModel");
const Address = require("../models/addressModel")

const loadUserProfile = async (req, res) => {
    try {
        const userId = req.session.userId
        const userDetails = await User.findOne({ _id : userId }).populate('address').exec();
        console.log('user details',userDetails);
        res.render(
            "user/profile",{
                userDetails : userDetails
            }
        )
    } catch (error) {
        console.log(error.message);
    }
}

const doAddAddress = async (req, res) => {
    try {
        const {fullname,
                mobile,
                landmark,
                city,
                pincode,
                district,
                state } = req.body;
        const userId = req.session.userId;
        const address = new Address({
            fullname: fullname,
            mobile: mobile,
            landmark: landmark,
            city: city,
            pincode: pincode,
            district: district,
            state: state,
            userId: userId
        })
        const addressData = await address.save();
        const userData = await User.updateOne({_id: userId},{
            $push: {address: addressData._id}
        })
        console.log(userData)
        res.status(200).json({ success: true });
        console.log('address saved')
    } catch (error) {
        console.log(error.message)
    }
}

const doEditAddress = async(req, res) => {
    try {
        const {addressId,
            fullname,
            mobile,
            landmark,
            city,
            pincode,
            district,
            state } = req.body;
        const addressData = await Address.findByIdAndUpdate(
            {_id: addressId},
            { $set: { 
                fullname: fullname,
                mobile: mobile,
                landmark: landmark,
                city: city,
                pincode: pincode,
                district: district,
                state: state,
             } } 
        );
        res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
    }
}

const doDeleteAddress = async (req, res) => {
    try {
        const userId = req.session.userId;
        const addressId = req.body.addressId;
        const userData = await User.updateOne({ _id: userId }, {
            $pull: {address: addressId}
        });
        const addressData = await Address.deleteOne({ _id: addressId });
        console.log("userData after delete address:", userData)
        res.status(200).json({success: true});
        console.log('address deleted')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadUserProfile,
    doAddAddress,
    doDeleteAddress,
    doEditAddress,
}