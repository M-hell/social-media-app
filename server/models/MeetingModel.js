const mongoose = require('mongoose');

const MeetingSchema= new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    groupCall: {
        type: Boolean,
        default: false
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const MeetingModel = mongoose.model('Meeting', MeetingSchema);


module.exports = MeetingModel;