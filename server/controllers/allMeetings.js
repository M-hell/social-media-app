const MeetingModel = require('../models/MeetingModel');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");

async function getAllMeetings(req, res) {
    try {
        const token = req.cookies.token || "";

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
                error: true
            });
        }

        const user = await getUserDetailsFromToken(token);
        const userId = user._id;

        // Find active meetings where the user is either the creator or a participant
        const meetings = await MeetingModel.find({
            isActive: true,
            $or: [
                { participants: userId },
                { createdBy: userId }
            ]
        })
        .populate('createdBy', '-password')
        .populate('participants', '-password')
        .sort({ updatedAt: -1 }); // Optional: latest meetings first

        return res.status(200).json({
            message: "Active meetings fetched successfully",
            data: meetings,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true
        });
    }
}

module.exports = getAllMeetings;
