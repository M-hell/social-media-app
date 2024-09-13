const UserModel = require('../models/UserModel')
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function increaseFollowing(request, response) {
    try {
        const token = request.cookies.token || ""
        const userDetails = await getUserDetailsFromToken(token)
        const userinfo = await UserModel.findById(userDetails._id)

        const { followingid } = request.body
        userinfo.following.push(followingid)
        const userSave = await userinfo.save()
        
        const followinguser = await UserModel.findById(followingid)
        followinguser.followers.push(userDetails._id)
        const followinguserSave = await followinguser.save()
        
        return response.json({
            message: "user followed successfully",
            data: userSave,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = increaseFollowing