const CommunityModel = require("../models/CommunityModel");
const UserModel = require("../models/UserModel");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function createCommunity(request, response) {
    console.log("create community called");
    try {
        const token = request.cookies.token || "";
        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true
            });
        }

        const user = await getUserDetailsFromToken(token);
        const { name, participants } = request.body;
        
        // Ensure participants is an array and add the current user
        const participantsList = Array.isArray(participants) ? [...participants] : [];
        participantsList.push(user._id);

        const payload = {
            name,
            createdBy: user._id,
            participants: participantsList
        };

        const community = new CommunityModel(payload);
        const communitySave = await community.save();

        // Handle users without communities field
        if (!user.communities) {
            user.communities = [];
        }
        
        user.communities.push(communitySave._id);
        await user.save();

        // Update all participants to include this community in their communities array
        await UserModel.updateMany(
            { 
                _id: { $in: participantsList },
                communities: { $exists: false }
            },
            { 
                $set: { communities: [] }
            }
        );

        // Add community to all participants' communities array
        await UserModel.updateMany(
            { _id: { $in: participantsList } },
            { $addToSet: { communities: communitySave._id } }
        );

        return response.json({
            message: "Community created successfully",
            data: communitySave,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = createCommunity;