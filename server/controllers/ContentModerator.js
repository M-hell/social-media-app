const { GoogleGenerativeAI } = require('@google/generative-ai');
const PostModel = require('../models/PostModel');
const { ConversationModel, MessageModel } = require('../models/ConversationModel');

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
    const messages = await MessageModel.find({ contentmoderationcheck: false }); // Find unchecked messages
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const deletedPosts = [];
    const deletedMessages = [];
    const batchSize = 10; // Process posts and messages in batches

    // Process posts for moderation
    for (let i = 0; i < posts.length; i += batchSize) {
        const batch = posts.slice(i, i + batchSize);

        for (let post of batch) {
            const description = post.description;
            const prompt = `description - ${description}. In this description, is there any vulgar words or racist, discriminatory, or offensive language? If yes, just say yes; if no, just say no.`;

            try {
                const result = await generateContentWithRetry(genAI, prompt);
                const responseText = await result.response.text();

                if (responseText.includes("SAFETY")) {
                    console.error(`Post with ID ${post._id} was blocked due to safety concerns. Deleting post...`);
                    await PostModel.findByIdAndDelete(post._id);
                    deletedPosts.push(post);
                    continue;
                }

                if (responseText.toLowerCase().includes("yes")) {
                    deletedPosts.push(post);
                    await PostModel.findByIdAndDelete(post._id);
                } else {
                    post.contentmoderationcheck = true;
                    await post.save();
                }
            } catch (error) {
                console.error(`Error processing post with ID ${post._id}: ${error.message}`);
            }
        }

        await delay(10000); // Delay between batches
    }

    // Process messages for moderation
    for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);

        for (let message of batch) {
            const text = message.text;
            const prompt = `text - ${text}. In this text, is there any vulgar words or racist, discriminatory, or offensive language? If yes, just say yes; if no, just say no.`;

            try {
                const result = await generateContentWithRetry(genAI, prompt);
                const responseText = await result.response.text();

                if (responseText.includes("SAFETY")) {
                    console.error(`Message with ID ${message._id} was blocked due to safety concerns. Deleting message...`);
                    await MessageModel.findByIdAndDelete(message._id);
                    deletedMessages.push(message);
                    continue;
                }

                if (responseText.toLowerCase().includes("yes")) {
                    deletedMessages.push(message);
                    await MessageModel.findByIdAndDelete(message._id);
                } else {
                    message.contentmoderationcheck = true;
                    await message.save();
                }
            } catch (error) {
                console.error(`Error processing message with ID ${message._id}: ${error.message}`);
            }
        }

        await delay(10000); // Delay between batches
    }

    return res.json({ deletedPosts, deletedMessages });
};

module.exports = ContentModerator;
