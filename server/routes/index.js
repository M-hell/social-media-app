const express=require('express')
const router=express.Router()

const registerUser=require('../controllers/registerUser.js')
const checkEmail = require('../controllers/checkEmail.js')
const checkPassword=require('../controllers/checkPassword.js')
const userDetails=require('../controllers/userDetails.js')
const logout=require('../controllers/logout.js')
const updateUserDetails=require('../controllers/updateUserDetails.js')
const addPost=require('../controllers/addPost.js')
const addComment=require('../controllers/addComment.js')
const upvote=require('../controllers/upvote.js')
const downvote=require('../controllers/downvote.js')
const allPosts=require('../controllers/allPosts.js')
const searchAllUsers=require('../controllers/searchAllUsers.js')
const otherUserDetails=require('../controllers/otherUserDetails.js')
const increaseFollowing=require('../controllers/increaseFollowing.js')
const allFollowersFollowing=require('../controllers/allFollowersFollowing.js')
const ranking=require('../controllers/ranking.js')
// const imageModerator=require('../controllers/ImageModerator.js')
const ContentModerator=require('../controllers/ContentModerator.js')

//user registering
router.post('/register',registerUser)

//email confirming
router.post('/email',checkEmail)

//password checking ,creating cookie
router.post('/password',checkPassword)

//give user details
router.get('/user-details',userDetails)

//logout ,clearing cookie
router.get('/logout',logout)

//updating details after verifying the cookie is right
router.post('/update-user',updateUserDetails)

//add post
router.post('/add-post',addPost)

//add comment
router.post('/add-comment',addComment)

//upvote
router.post('/upvote',upvote)

//downvote
router.post('/downvote',downvote)

//all posts
router.get('/all-posts',allPosts)

//search all users
router.post('/search-all-users',searchAllUsers)

//other user details
router.post('/other-user-details',otherUserDetails)

//increase following
router.post('/increase-following',increaseFollowing)

//all followers
router.post('/all-followers-following',allFollowersFollowing)

//ranking
router.post('/ranking',ranking)

//image moderation check
// router.post('/moderate-image',imageModerator)

//content moderation check
router.post('/moderate-content',ContentModerator)


module.exports=router