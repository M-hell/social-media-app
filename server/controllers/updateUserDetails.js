const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

async function updateUserDetails(request,response){
    console.log("updateuserdetails endpoint called")
    const token = request.cookies.token || ""
    try {
        if(token===""){
            return response.status(401).json({
                message : "please login first",
                error : true
            })
        }
        const user = await getUserDetailsFromToken(token)
        const { name, email, profile_pic } = request.body

        const updateUser = await UserModel.updateOne({ _id : user._id },{
            email,
            name,
            profile_pic
        })

        const userInfomation = await UserModel.findById(user._id)

        return response.json({
            message : "user update successfully",
            data : userInfomation,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateUserDetails