const mongoose=require('mongoose')

const PostSchema = new mongoose.Schema({
    postimg: {
        type: String,
    },
    description: {
        type: String,
    },
    upvotescount: {
        type: Number,
        default: 0
    },
    downvotescount: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    contentmoderationcheck: {
        type: Boolean,
        default: false
    }
}
,{
    timestamps : true
})

const PostModel = mongoose.model('Post', PostSchema)

module.exports = PostModel