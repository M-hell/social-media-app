const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function upvote(request, response) {
    try {
        console.log("upvote controller called")
        const token = request.cookies.token || ""
        console.log("token", token)
        if(token===""){
            return response.status(401).json({
                message : "please login first",
                error : true
            })
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

        const hasUpvoted = post.upvotescount.includes(userId);
        const hasDownvoted = post.downvotescount.includes(userId);

        if (hasUpvoted) {
            // User already upvoted -> remove the upvote (toggle off)
            post.upvotescount.pull(userId);
            author.upvotes = Math.max(0, author.upvotes - 1); // Prevent negative
        } else {
            // Add to upvotes
            post.upvotescount.push(userId);

            // Remove from downvotes if exists
            if (hasDownvoted) {
                post.downvotescount.pull(userId);
            }

            author.upvotes += 1;
        }

        await post.save();
        await author.save();
        console.log("Post after upvote operation:", post);

        return response.json({
            message: hasUpvoted ? "Upvote removed" : "Upvoted successfully",
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

module.exports = upvote;
