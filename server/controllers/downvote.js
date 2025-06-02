const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function downvote(request, response) {
    try {
        console.log("downvote controller called");
        const token = request.cookies.token || "";
        console.log("token", token);
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const { postId } = request.body;
        const user = await getUserDetailsFromToken(token);

        const post = await PostModel.findById(postId).populate('author');
        if (!post) {
            return response.status(404).json({
                message: "Post not found",
                error: true
            });
        }

        const author = await UserModel.findById(post.author._id);
        if (!author) {
            return response.status(404).json({
                message: "Author not found",
                error: true
            });
        }

        const userId = user._id.toString();

        const hasDownvoted = post.downvotescount.includes(userId);
        const hasUpvoted = post.upvotescount.includes(userId);

        if (hasDownvoted) {
            // User already downvoted -> remove the downvote (toggle off)
            post.downvotescount.pull(userId);
            author.downvotes = Math.max(0, author.downvotes - 1); // Prevent negative
        } else {
            // Add to downvotes
            post.downvotescount.push(userId);

            // Remove from upvotes if exists
            if (hasUpvoted) {
                post.upvotescount.pull(userId);
                author.upvotes = Math.max(0, author.upvotes - 1);
            }

            author.downvotes += 1;
        }

        await post.save();
        await author.save();
        console.log("Post after downvote operation:", post);

        return response.json({
            message: hasDownvoted ? "Downvote removed" : "Downvoted successfully",
            data: post,
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
