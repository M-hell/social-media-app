const UserModel = require("../models/UserModel");
async function allFollowersFollowing(request, response) {
    try {
        const token = request.cookies.token || "";
        const { _id } = request.body;

        // Check if the token is valid and available
        if (!token) {
            return response.status(400).json({
                message: "Token is missing",
                error: true
            });
        }

        // Get user details from the token
        const user = await UserModel.findById(_id).populate("followers").populate("following");

        // Check if user data is valid
        if (!user) {
            return response.status(500).json({
                message: "User data is invalid",
                error: true
            });
        }

        const followers = user.followers;
        const following = user.following;

        // Combine followers and following, and convert to a Set to remove duplicates
        const allFollowersSet = new Set([...followers, ...following]);

        // Convert the Set back to an array
        const allFollowers = Array.from(allFollowersSet);

        return response.json({
            message: "All followers and following",
            data: allFollowers
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || 'Server error',
            error: true
        });
    }
}

module.exports = allFollowersFollowing;
