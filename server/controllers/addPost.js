const PostModel = require("../models/PostModel")
const UserModel = require("../models/UserModel")
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function addPost(request,response){
    try {
        const token = request.cookies.token || ""
        if(token===""){
            return response.status(401).json({
                message : "please login first",
                error : true
            })
        }
        const user = await getUserDetailsFromToken(token)
        const {postimg,description} = request.body
        const payload = {
            postimg,
            description,
            author : user._id
        }
        const post = new PostModel(payload)
        const postSave = await post.save()
        const userinfo = await UserModel.findById(user._id)
        userinfo.posts.push(postSave._id)
        await userinfo.save()
        return response.json({
            message : "post added successfully",
            data : postSave,
            success : true
        })
    }
    catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = addPost