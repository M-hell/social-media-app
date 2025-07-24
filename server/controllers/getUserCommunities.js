const CommunityModel = require("../models/CommunityModel");
const UserModel = require("../models/UserModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function getUserCommunities(request, response) {
    console.log("get user communities called");
    try {
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const user = await getUserDetailsFromToken(token);

        // Handle users who don't have communities field (old users)
        if (!user.communities || user.communities.length === 0 || !Array.isArray(user.communities) ) {//community array exists or not
            return response.json({
                message: "No communities found",
                data: [],
                success: true,
                totalCommunities: 0
            });
        }

        // Get all communities where user is a participant with detailed information
        const communities = await CommunityModel.find({
            _id: { $in: user.communities }
        })
        .populate('createdBy', 'name email profile_pic') // Get creator details
        .populate('participants', 'name email profile_pic') // Get all participants details
        .populate({
            path: 'messages',
            options: { 
                sort: { createdAt: -1 }, // Latest message first
                limit: 1 // Only get the latest message
            }
        })
        .sort({ updatedAt: -1 }); // Sort communities by most recently updated

        // Transform the data to include additional useful information
        const communitiesWithDetails = communities.map(community => {
            const communityObj = community.toObject();
            
            return {
                ...communityObj,
                participantCount: community.participants.length,
                messageCount: community.messages.length,
                isCreator: community.createdBy._id.toString() === user._id.toString(),
                lastMessage: community.messages.length > 0 ? community.messages[0] : null,
                joinedAt: community.createdAt // When community was created
            };
        });

        return response.json({
            message: "Communities retrieved successfully",
            data: communitiesWithDetails,
            success: true,
            totalCommunities: communitiesWithDetails.length,
            userInfo: {
                userId: user._id,
                userName: user.name
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true
        });
    }
}

module.exports = getUserCommunities;