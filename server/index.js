require('dotenv').config()

const { app, server } = require('./socket/index.js')
const express=require('express')
const PORT=process.env.PORT || 3000


//cors setup for cross origin requests
const cors=require('cors')
app.use(cors(
    {
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST","DELETE","PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
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


//for deploying
const path=require('path');
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});


//for db connection
const connectDB = require('./db/connectDb.js');
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}/`);
            
            // Start cron job only after DB & server are ready
            const job = require('./cron.js');
            job.start();
            console.log("Cron job started (keeps server awake).");
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1); // Exit if DB fails
    });