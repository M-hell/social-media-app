const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    msgbyuserid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentcontent: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const CommentModel = mongoose.model('Comment', commentSchema);
module.exports = CommentModel;