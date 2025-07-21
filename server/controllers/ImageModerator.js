// const { GoogleGenerativeAI} = require('@google/generative-ai');
// const { GoogleAIFileManager } = require('@google/generative-ai'); // Adjust according to your package



// // Initialize the generative AI client with your API key

// async function imageModerator(req, res) {
//     const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

//     const uploadResult = await fileManager.uploadFile(
//       `${mediaPath}/jetpack.jpg`,
//       {
//         mimeType: "image/jpeg",
//         displayName: "Jetpack drawing",
//       },
//     );
//     // View the response.
//     console.log(
//       `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
//     );
    
//     const genAI = new GoogleGenerativeAI(process.env.API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent([
//       "Tell me about this image.",
//       {
//         fileData: {
//           fileUri: uploadResult.file.uri,
//           mimeType: uploadResult.file.mimeType,
//         },
//       },
//     ]);
//     console.log(result.response.text());
// }

// module.exports = imageModerator;
