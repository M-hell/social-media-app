const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function downvote(request, response) {
    try {
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const { postId } = request.body;
        const user = await getUserDetailsFromToken(token);

        // Fetch the post and populate the author
        const post = await PostModel.findById(postId).populate('author');
        if (!post) {
            return response.status(404).json({
                message: "Post not found",
                error: true
            });
        }

        // Fetch the author details
        const author = post.author;
        if (!author) {
            return response.status(404).json({
                message: "Author not found",
                error: true
            });
        }

        // Update the downvote count for the post and the author
        post.downvotescount += 1;
        author.downvotes += 1;

        // Save the updated post and author
        const postsave = await post.save();
        await author.save();

        return response.json({
            message: "Downvoted successfully",
            data: postsave,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = downvote;
