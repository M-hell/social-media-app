const CommunityModel = require("../models/CommunityModel");
const UserModel = require("../models/UserModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function manageCommunityParticipants(request, response) {
    console.log("manage community participants called");
    const { type, communityId, userIds } = request.body;
    console.log("type:", type, "communityId:", communityId, "userIds:", userIds);
    
    try {
        // Authentication check
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const currentUser = await getUserDetailsFromToken(token);

        // Validation
        if (!type || !communityId || !userIds) {
            return response.status(400).json({
                message: "Type, communityId, and userIds are required",
                error: true
            });
        }

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return response.status(400).json({
                message: "userIds must be a non-empty array",
                error: true
            });
        }

        if (type !== "add" && type !== "remove") {
            return response.status(400).json({
                message: "Type must be either 'add' or 'remove'",
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

        // Check if current user is the creator (authorization)
        if (community.createdBy.toString() !== currentUser._id.toString()) {
            return response.status(403).json({
                message: "Only the community creator can manage participants",
                error: true
            });
        }

        // Find all target users
        const targetUsers = await UserModel.find({ _id: { $in: userIds } });
        const foundUserIds = targetUsers.map(user => user._id.toString());
        const notFoundUserIds = userIds.filter(id => !foundUserIds.includes(id));

        if (notFoundUserIds.length > 0) {
            return response.status(404).json({
                message: `Users not found: ${notFoundUserIds.join(', ')}`,
                error: true
            });
        }

        const results = [];
        const errors = [];

        if (type === "add") {
            for (const userId of userIds) {
                try {
                    // Check if user is already a participant
                    const isAlreadyParticipant = community.participants.some(
                        participant => participant.toString() === userId
                    );

                    if (isAlreadyParticipant) {
                        const targetUser = targetUsers.find(user => user._id.toString() === userId);
                        errors.push({
                            userId,
                            userName: targetUser.name,
                            message: "User is already a participant in this community"
                        });
                        continue;
                    }

                    // Add user to community participants
                    await CommunityModel.findByIdAndUpdate(
                        communityId,
                        { $addToSet: { participants: userId } }
                    );

                    const targetUser = targetUsers.find(user => user._id.toString() === userId);
                    
                    // Handle target user's communities field if it doesn't exist
                    if (!targetUser.communities) {
                        targetUser.communities = [];
                    }
                    
                    // Add community to user's communities array
                    await UserModel.findByIdAndUpdate(
                        userId,
                        { $addToSet: { communities: communityId } }
                    );

                    results.push({
                        userId,
                        userName: targetUser.name,
                        action: "added"
                    });
                } catch (error) {
                    const targetUser = targetUsers.find(user => user._id.toString() === userId);
                    errors.push({
                        userId,
                        userName: targetUser?.name || "Unknown",
                        message: "Failed to add user to community"
                    });
                }
            }

            return response.json({
                message: `Successfully processed ${results.length} users`,
                success: true,
                data: {
                    communityId,
                    results,
                    errors: errors.length > 0 ? errors : undefined
                }
            });
        }

        if (type === "remove") {
            for (const userId of userIds) {
                try {
                    // Check if user is actually a participant
                    const isParticipant = community.participants.some(
                        participant => participant.toString() === userId
                    );

                    if (!isParticipant) {
                        const targetUser = targetUsers.find(user => user._id.toString() === userId);
                        errors.push({
                            userId,
                            userName: targetUser.name,
                            message: "User is not a participant in this community"
                        });
                        continue;
                    }

                    // Prevent removing the creator
                    if (community.createdBy.toString() === userId) {
                        const targetUser = targetUsers.find(user => user._id.toString() === userId);
                        errors.push({
                            userId,
                            userName: targetUser.name,
                            message: "Cannot remove the community creator"
                        });
                        continue;
                    }

                    // Remove user from community participants
                    await CommunityModel.findByIdAndUpdate(
                        communityId,
                        { $pull: { participants: userId } }
                    );

                    const targetUser = targetUsers.find(user => user._id.toString() === userId);

                    // Remove community from user's communities array (if field exists)
                    await UserModel.findByIdAndUpdate(
                        userId,
                        { $pull: { communities: communityId } }
                    );

                    results.push({
                        userId,
                        userName: targetUser.name,
                        action: "removed"
                    });
                } catch (error) {
                    const targetUser = targetUsers.find(user => user._id.toString() === userId);
                    errors.push({
                        userId,
                        userName: targetUser?.name || "Unknown",
                        message: "Failed to remove user from community"
                    });
                }
            }

            return response.json({
                message: `Successfully processed ${results.length} users`,
                success: true,
                data: {
                    communityId,
                    results,
                    errors: errors.length > 0 ? errors : undefined
                }
            });
        }

    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            error: true
        });
    }
}

module.exports = manageCommunityParticipants;