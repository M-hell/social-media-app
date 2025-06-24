const UserModel = require('../models/userModel');
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

        // Validate participant ID is provided
        if (!participantId) {
            return res.status(400).json({
                message: "Participant ID is required",
                error: true
            });
        }

        // Create consistent room ID by combining user IDs in sorted order
        const roomId = [user._id.toString(), participantId].sort().join('_');
        
        // Check if meeting already exists between these users
        const existingMeeting = await MeetingModel.findOne({ roomId })
            .populate('createdBy', '-password')
            .populate('participants', '-password');
        
        existingMeeting.isActive = true; // Ensure the meeting is active
        await existingMeeting.save();

        if (existingMeeting) {
            return res.status(200).json({
                message: "Meeting already exists",
                data: existingMeeting,
                success: true
            });
        }
        
        // Create new meeting
        const meeting = new MeetingModel({
            roomId,
            createdBy: user._id,
            groupCall: false,
            participants: [participantId], // Single participant in array
            isActive: true
        });

        const savedMeeting = await meeting.save();
        
        // Populate user details in the response
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