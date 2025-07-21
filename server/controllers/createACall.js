const UserModel = require('../models/UserModel');
const MeetingModel = require('../models/MeetingModel');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function createACall(req, res) {
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

        // Get participant ID from request body
        const { participantId } = req.body;

        if (!participantId) {
            return res.status(400).json({
                message: "Participant ID is required",
                error: true
            });
        }

        // Create unique room ID using sorted user IDs
        const roomId = [user._id.toString(), participantId.toString()].sort().join('_');

        // Check if a meeting with the same room ID already exists
        const existingMeeting = await MeetingModel.findOne({ roomId })
            .populate('createdBy', '-password')
            .populate('participants', '-password');

        // ✅ Fix: Only modify if meeting exists
        if (existingMeeting) {
            existingMeeting.isActive = true;
            await existingMeeting.save();

            return res.status(200).json({
                message: "Meeting already exists",
                data: existingMeeting,
                success: true
            });
        }

        // If not exists, create a new one-on-one meeting
        const meeting = new MeetingModel({
            roomId,
            createdBy: user._id,
            groupCall: false,
            participants: [participantId],
            isActive: true
        });

        const savedMeeting = await meeting.save();

        // Populate details for response
        const populatedMeeting = await MeetingModel.findById(savedMeeting._id)
            .populate('createdBy', '-password')
            .populate('participants', '-password');

        return res.status(200).json({
            message: "One-on-one meeting created successfully",
            data: populatedMeeting,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true
        });
    }
}

module.exports = createACall;
