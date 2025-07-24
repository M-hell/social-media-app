const CommunityModel = require("../models/CommunityModel");
const UserModel = require("../models/UserModel");
const CommunityMessageModel = require("../models/CommunityMessage");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function deleteCommunity(request, response) {
    console.log("delete community called");
    try {
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const user = await getUserDetailsFromToken(token);
        const { communityId } = request.params; // or request.body, depending on your route setup

        if (!communityId) {
            return response.status(400).json({
                message: "Community ID is required",
                error: true
            });
        }

        // Find the community
        const community = await CommunityModel.findById(communityId);
        
        if (!community) {
            return response.status(404).json({
                message: "Community not found",
                error: true
            });
        }

        // Check if the user is the creator of the community
        if (community.createdBy.toString() !== user._id.toString()) {
            return response.status(403).json({
                message: "Only the community creator can delete this community",
                error: true
            });
        }

        // Get all participants before deletion
        const participantsList = community.participants || [];

        // Delete all messages in the community
        if (community.messages && community.messages.length > 0) {
            await CommunityMessageModel.deleteMany({
                _id: { $in: community.messages }
            });
        }

        // Remove community from all participants' communities arrays
        // Handle users who might not have communities field
        await UserModel.updateMany(
            { 
                _id: { $in: participantsList },
                communities: { $exists: true }
            },
            { 
                $pull: { communities: communityId }
            }
        );

        // Delete the community
        await CommunityModel.findByIdAndDelete(communityId);

        return response.json({
            message: "Community deleted successfully",
            success: true,
            data: {
                deletedCommunityId: communityId,
                participantsAffected: participantsList.length
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = deleteCommunity;