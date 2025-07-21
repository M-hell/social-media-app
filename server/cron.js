const cron = require("cron");
const axios = require("axios");
const { app } = require('./socket/index.js');

const URL = "https://social-media-app-rfuc.onrender.com";

const job = new cron.CronJob("*/14 * * * *", async () => {
    try {
        const response = await axios.get(URL);
        console.log("GET request sent successfully. Status:", response.status);
    } catch (error) {
        console.error("Error while sending request:", error.message);
        
        if (error.response) {
            console.error("Failed with status:", error.response.status);
        }
    }
});

module.exports = job;