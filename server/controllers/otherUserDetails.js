const UserModel=require('../models/UserModel')

async function otherUserDetails(request,response){
    try {
        const {userId}=request.body
        const user = await UserModel.findById(userId).select('-password')
        return response.json({
            message : "user details fetched successfully",
            data : user
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = otherUserDetails