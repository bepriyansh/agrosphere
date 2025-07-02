const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const { saveAIResponse } = require('../db/db');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAIN_SERVICE_URL = process.env.MAIN_SERVICE_URL;
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function processAI(dataId, postData = null) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    if (!postData) {
      await saveAIResponse(dataId, "No post data found.");
      return;
    }

    const prompt = postData.text || "";

    // Convert images to base64
    let imageParts = [];
    if (Array.isArray(postData.imageUrls)) {
      for (const url of postData.imageUrls) {
        try {
          const response = await axios.get(url, { responseType: 'arraybuffer' });
          const base64 = Buffer.from(response.data, 'binary').toString('base64');
          imageParts.push({
            inlineData: {
              data: base64,
              mimeType: "image/jpeg"
            }
          });
        } catch (err) {
          console.warn(`Failed to fetch image: ${url} for ${dataId}:`, err.message);
        }
      }
    }

    if (!prompt && imageParts.length === 0) {
      await saveAIResponse(dataId, "No useful content (image or text) found.");
      return;
    }

    const parts = [{ text: prompt }, ...imageParts];

    // Call AI model
    let aiInsight = "Unable to generate AI response.";
    try {
      const result = await model.generateContent({ contents: [{ parts }] });
      aiInsight = result.response.text();
    } catch (err) {
      console.error(` Gemini API error for ${dataId}:`, err.message);
    }

    // Save response
    await saveAIResponse(dataId, aiInsight);
    console.log(` AI processed and saved response for ${dataId}`);

    // Sending response to main service 
    try {
      await axios.post(`${MAIN_SERVICE_URL}/api/v1/service/ai`, {
        aiResponse: aiInsight,
        metaData: postData.metaData || {}
      });
      console.log(` AI response sent to main service for ${dataId}`);
      await redis.del(`data:${dataId}`);
    } catch (err) {
      console.error(` Failed to send AI response to main service for ${dataId}:`, err.message);
    }
  } catch (err) {
    console.error(` AI processing failed for ${dataId}:`, err.message);
    await saveAIResponse(dataId, "Internal error during AI processing.");
  }
}

module.exports = processAI;
