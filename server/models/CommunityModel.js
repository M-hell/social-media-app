const mongoose = require('mongoose');
const UserModel = require('./UserModel');
const CommunityMessageModel = require('./CommunityMessage');

const CommunityModelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        default: "",
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
    },
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }],
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: "CommunityMessage",
    }],
}, {
  timestamps: true,
});
const CommunityModel = mongoose.model('Community', CommunityModelSchema);
module.exports = CommunityModel;