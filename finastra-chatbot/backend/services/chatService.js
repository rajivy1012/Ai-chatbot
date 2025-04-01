// backend/services/chatService.js
const GeminiService = require('./geminiservice');

class ChatService {
    constructor() {
        this.geminiService = new GeminiService();
    }

    async processMessage(message, userProfile) {
        try {
            console.log('Processing message:', { message, userProfile });
            
            // Get response from Gemini
            const response = await this.geminiService.generateResponse(message, userProfile);
            console.log('Gemini response:', response);

            return {
                type: 'TEXT',
                message: response.message
            };
        } catch (error) {
            console.error('Error in ChatService:', error);
            throw error;
        }
    }
}

module.exports = ChatService;