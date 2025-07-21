const PostModel = require("../models/PostModel");

async function deletePost(req, res) {
    console.log("deletePost endpoint called");
    const token = req.cookies.token || "";
    
    try {
        // Check if user is authenticated
        if (!token) {
            return res.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        // Get post ID from URL parameters
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                message: "Post ID is required",
                error: true
            });
        }

        // Find and delete the post
        const deletedPost = await PostModel.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                message: "Post not found",
                error: true
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully",
            data: deletedPost,
            error: false
        });

    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            details: error.message
        });
    }
}

module.exports = deletePost;