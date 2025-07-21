const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Initialize Vertex AI
const projectId= process.env.GOOGLE_PROJECT_ID;
const endpointId=process.env.GOOGLE_ENDPOINT_ID;
const ai = new GoogleGenAI({
  vertexai: true,
  project: projectId,
  location: 'us-central1',
});

const model = `projects/${projectId}/locations/us-central1/endpoints/${endpointId}`;
console.log("Model:", model);

const generationConfig = {
  maxOutputTokens: 8192,
  temperature: 1,
  topP: 0.95,
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' }
  ],
};

const cleanMarkdown = (text) => {
  return text
    .replace(/[*`]+/g, '')                      // Remove *, **, `
    .replace(/(\.)(\s)([A-Z])/g, '$1\n$3')      // Add line break after sentence
    .replace(/\s{2,}/g, ' ')                    // Normalize excessive spaces
    .replace(/(\d+\.)\s+/g, '\n$1 ')            // Add newline before numbered points
    .replace(/([-–•])\s+/g, '\n$1 ')            // Add newline before bullets
    .trim();
};

const returnGeminiResponseTuned = async (prompt) => {
    console.log("tune model endpoint hit");
    console.log("Prompt:", prompt);
  try {
    const req_data = {
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: generationConfig
    };

    const streamingResp = await ai.models.generateContentStream(req_data);

    let fullResponse = '';
    for await (const chunk of streamingResp) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }
    console.log("Full Response:", fullResponse);
    return cleanMarkdown(fullResponse);
  } catch (error) {
    return error;
  }
};

module.exports = returnGeminiResponseTuned;
