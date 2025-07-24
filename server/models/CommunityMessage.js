const mongoose = require("mongoose");
const UserModel = require("./UserModel");

const CommunityMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    contentmoderationcheck: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CommunityMessageModel = mongoose.model(
  "CommunityMessage",
  CommunityMessageSchema
);
module.exports = CommunityMessageModel;
