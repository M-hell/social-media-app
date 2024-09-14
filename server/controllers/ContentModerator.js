const { GoogleGenerativeAI } = require('@google/generative-ai');
const PostModel = require('../models/PostModel');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const generateContentWithRetry = async (genAI, prompt, retries = 5) => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            return await model.generateContent(prompt);
        } catch (error) {
            if (error.status === 429 && attempt < retries - 1) {
                const delayTime = Math.pow(2, attempt) * 2000; // Exponential backoff
                console.log(`429 error: Too many requests. Retrying in ${delayTime / 1000} seconds...`);
                await delay(delayTime);
                attempt++;
            } else {
                throw error; // Re-throw if not a 429 error or retries exceeded
            }
        }
    }
};

const ContentModerator = async (req, res) => {
    console.log("Content moderation triggered");
    const posts = await PostModel.find({ contentmoderationcheck: false }); // Only find unchecked posts
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const deletedPosts = [];
    const batchSize = 10; // Process posts in batches

    for (let i = 0; i < posts.length; i += batchSize) {
        const batch = posts.slice(i, i + batchSize);

        for (let post of batch) {
            const description = post.description;
            const prompt = `description - ${description}. In this description, is there any vulgar words or racist, discriminatory, or offensive language? If yes, just say yes; if no, just say no.`;

            try {
                const result = await generateContentWithRetry(genAI, prompt);
                const responseText = await result.response.text();

                // Handling "SAFETY" blocked candidates
                if (responseText.includes("SAFETY")) {
                    console.error(`Post with ID ${post._id} was blocked due to safety concerns. Deleting post...`);
                    await PostModel.findByIdAndDelete(post._id); // Delete post when "SAFETY" is triggered
                    deletedPosts.push(post);
                    continue;
                }

                // Check for any variation of "yes"
                if (responseText.toLowerCase().includes("yes")) {
                    deletedPosts.push(post);
                    await PostModel.findByIdAndDelete(post._id); // Delete post if flagged
                } else {
                    // If the post is safe, update `contentModerationCheck` to true
                    post.contentmoderationcheck = true;
                    await post.save();
                }
            } catch (error) {
                if (error.message.includes("SAFETY")) {
                    console.error(`Post with ID ${post._id} was blocked due to SAFETY error: ${error.message}`);
                    await PostModel.findByIdAndDelete(post._id); // Delete post in case of a safety error
                    deletedPosts.push(post);
                } else if (error.status === 429) {
                    console.error(`Error processing post with ID ${post._id}: ${error.message}`);
                } else {
                    console.error(`Error processing post with ID ${post._id}: ${error.message}`);
                }
            }
        }

        // Delay between batches to avoid API rate-limiting
        await delay(10000); // 10 seconds delay between batches
    }

    return res.json({ deletedPosts });
};

module.exports = ContentModerator;
