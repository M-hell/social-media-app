const MeetingModel = require('../models/MeetingModel');

async function endMeeting(req, res) {
    try {
        const { userId, participantId } = req.body;

        if (!userId || !participantId) {
            return res.status(400).json({
                message: "Both userId and participantId are required",
                error: true
            });
        }

        // Generate consistent roomId
        const roomId = [userId.toString(), participantId.toString()].sort().join('_');

        // Find the meeting
        const meeting = await MeetingModel.findOne({ roomId });

        if (!meeting) {
            return res.status(404).json({
                message: "Meeting not found",
                error: true
            });
        }

        // Update isActive to false
        meeting.isActive = false;
        await meeting.save();

        return res.status(200).json({
            message: "Meeting ended successfully",
            data: meeting,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server error",
            error: true
        });
    }
}

module.exports = endMeeting;
