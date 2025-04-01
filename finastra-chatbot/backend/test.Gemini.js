// backend/test-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI('GEMINI_API_KEY');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = "Give me a quick summary of the stock market.";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('Gemini Test Response:', response.text());
        console.log('API working correctly!');
    } catch (error) {
        console.error('Error testing Gemini API:', error);
    }
}

testGemini();