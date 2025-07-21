const PostModel = require("../models/PostModel");

async function updatePost(req, res) {
    console.log("updatePost endpoint called");
    const token = req.cookies.token || "";
    
    try {
        if (token === "") {
            return res.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const { _id, ...updateData } = req.body;
        
        if (!_id) {
            return res.status(400).json({
                message: "Post ID is required",
                error: true
            });
        }

        // Find the post by ID and update it
        const updatedPost = await PostModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: "Post not found",
                error: true
            });
        }

        return res.status(200).json({
            message: "Post updated successfully",
            data: updatedPost,
            error: false
        });

    } catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            details: error.message
        });
    }
}

module.exports = updatePost;