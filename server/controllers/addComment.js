const CommentModel = require("../models/CommentsModel");
const PostModel = require("../models/PostModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function addComment(request, response) {
    try {
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const { commentContent, postId } = request.body;
        const user = await getUserDetailsFromToken(token);

        const msgbyuserid = user._id;

        const payload = {
            commentcontent: commentContent,
            msgbyuserid,
            postId
        };

        // Create new comment
        const comment = new CommentModel(payload);
        const commentSave = await comment.save();

        // Push the comment to the post
        const post = await PostModel.findById(postId);
        post.comments.push(commentSave._id);
        await post.save();

        // Populate 'msgbyuserid' with user details like name and profile picture
        const populatedComment = await CommentModel.findById(commentSave._id).populate({
            path: 'msgbyuserid',
            select: 'name profile_pic'
        });

        return response.json({
            message: "Comment added successfully",
            data: populatedComment,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = addComment;
