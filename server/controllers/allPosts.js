const PostModel = require('../models/PostModel');

async function allPosts(request, response) {
    try {
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const posts = await PostModel.find({})
            .populate({ 
                path: 'author', 
                select: '-password'  // Exclude the password field when populating the author
            })
            .populate({
                path: 'comments',      // Populate the comments field
                populate: {
                    path: 'msgbyuserid',  // Inside comments, populate the msgbyuserid field
                    select: '-password'  // Populate name and profile picture
                }
            })
            .sort({ updatedAt: -1 });  // Sort by latest updated

        return response.json({
            message: "All posts",
            data: posts
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = allPosts;
