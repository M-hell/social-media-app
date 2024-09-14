require('dotenv').config()

const { app, server } = require('./socket/index.js')
const express=require('express')
const PORT=process.env.PORT || 3000


//cors setup
const cors=require('cors')
app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST"],
        credentials: true
    }
))


//cookie parser
const cookiesParser=require('cookie-parser')
app.use(cookiesParser())


//enables parsing json response
app.use(express.json())


//api endpoints
const router=require('./routes/index.js')
app.use('/api',router)


//db connection
const connectDB=require('./db/connectDb')
connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`app running on http://localhost:${PORT}/`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})