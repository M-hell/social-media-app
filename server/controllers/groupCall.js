const UserModel = require('../models/UserModel');
const MeetingModel = require('../models/MeetingModel');
const CommunityModel = require('../models/CommunityModel');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function groupCall(req, res) {
    console.log("Group call request received");
    try {
        const token = req.cookies.token || "";

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
                error: true
            });
        }

        // Get the authenticated user
        const user = await getUserDetailsFromToken(token);

        // Get community ID from request body
        const { communityId } = req.body;

        if (!communityId) {
            return res.status(400).json({
                message: "Community ID is required",
                error: true
            });
        }

        // Fetch community details with participants
        const community = await CommunityModel.findById(communityId)
            .populate('participants', '-password')
            .populate('createdBy', '-password');

        if (!community) {
            return res.status(404).json({
                message: "Community not found",
                error: true
            });
        }

        // Check if user is authorized (creator or participant)
        const isAuthorized = community.createdBy._id.toString() === user._id.toString() || 
                            community.participants.some(p => p._id.toString() === user._id.toString());

        if (!isAuthorized) {
            return res.status(403).json({
                message: "You are not authorized to create a call for this community",
                error: true
            });
        }

        // Get all participant IDs including creator
        const allParticipantIds = [
            community.createdBy._id.toString(),
            ...community.participants.map(p => p._id.toString())
        ];

        // Remove duplicates and sort for consistent room ID
        const uniqueParticipantIds = [...new Set(allParticipantIds)].sort();

        // Create unique room ID using community ID and sorted participant IDs
        const roomId = `community_${communityId}_${uniqueParticipantIds.join('_')}`;

        // Check if a meeting with the same room ID already exists
        const existingMeeting = await MeetingModel.findOne({ roomId })
            .populate('createdBy', '-password')
            .populate('participants', '-password');

        if (existingMeeting) {
            existingMeeting.isActive = true;
            await existingMeeting.save();

            return res.status(200).json({
                message: "Community group call already exists",
                data: existingMeeting,
                success: true
            });
        }

        // Create new community group meeting
        const meeting = new MeetingModel({
            roomId,
            createdBy: user._id,
            groupCall: true,
            participants: uniqueParticipantIds,
            isActive: true,
            communityId: communityId // Optional: if you want to store community reference
        });

        const savedMeeting = await meeting.save();

        // Populate details for response
        const populatedMeeting = await MeetingModel.findById(savedMeeting._id)
            .populate('createdBy', '-password')
            .populate('participants', '-password');

        return res.status(200).json({
            message: "Community group call created successfully",
            data: {
                ...populatedMeeting.toObject(),
                communityName: community.name,
                totalParticipants: uniqueParticipantIds.length
            },
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true
        });
    }
}

module.exports = groupCall;
