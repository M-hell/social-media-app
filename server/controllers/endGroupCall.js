const MeetingModel = require("../models/MeetingModel");
const CommunityModel = require("../models/CommunityModel");

async function endGroupCall(req, res) {
  try {
    const { meetingId } = req.body;
    console.log("Ending group call for meeting ID:", meetingId);
    if (!meetingId) {
      return res.status(400).json({
        message: "Meeting ID is required",
        error: true,
      });
    }
    const meetingroom = await MeetingModel.findById(meetingId);
    if (!meetingroom) {
      return res.status(404).json({
        message: "Meeting not found",
        error: true,
      });
    }
    const roomId = meetingroom.roomId;
 // Assuming meetingId is the roomId
    console.log("Room ID for group call:", roomId);
    // Find the meeting
    const meeting = await MeetingModel.findOne({ roomId });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
        error: true,
      });
    }

    // Update isActive to false
    meeting.isActive = false;
    await meeting.save();

    return res.status(200).json({
      message: "Meeting ended successfully",
      data: meeting,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
    });
  }
}

module.exports = endGroupCall;
