// backend/services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateResponse(message, userProfile) {
        try {
            const prompt = `
           You are a financial AI assistant helping a user with their investments and financial queries. Your goal is to provide personalized, trustworthy, and comprehensive advice based on the user's profile and current market conditions.

User Profile:
- Monthly Income: ₹${userProfile.monthlyIncome}
- Risk Tolerance: ${userProfile.riskTolerance} (e.g., Low, Medium, High)
- Investment Goals: ${userProfile.investmentGoals?.join(', ') || 'Not specified'} (e.g., Retirement, Down payment, Child's education)
- Time Horizon: ${userProfile.timeHorizon} (e.g., Short-term (less than 3 years), Medium-term (3-5 years), Long-term (5+ years))

User Query: "${message}"

Provide a helpful, personalized, and data-driven response based on their profile. Address the query directly and then provide additional relevant information based on the user's profile. Consider the following:

1. *Mutual Fund Suggestions (if applicable):*
    *   Prioritize alignment with the user's risk tolerance and time horizon.
    *   Provide the following data points (where available):
        *   Fund Name and Type (e.g., SBI Bluechip Fund - Large Cap)
        *   Expense Ratio (As a percentage)
        *   Past Performance: 1-year, 3-year (Annualized), 5-year (Annualized), Since inception (Annualized, if available)
        *   Risk Metrics: Standard Deviation (Volatility measure), Sharpe Ratio (Risk-adjusted return)
        *   Asset Allocation (Percentage breakdown of equity, debt, etc.)
        *   Fund Manager (Optional)
        *   Link to Factsheet/Fund Details (Optional)
    *   Explain the relevance of these data points to the user's profile in simple terms.
    *   Clearly state that past performance is not indicative of future results.
    *   Suggest a diversified portfolio rather than putting all eggs in one basket.

2. *Stocks (if applicable or if the user specifically asks):*
    *   Include current market insights and relevant news (e.g., Nifty/Sensex trends, sector performance, major economic events).
    *   Avoid giving specific stock recommendations unless explicitly requested and the user understands the risks. Instead, discuss general market trends, sector performance, and factors to consider when evaluating stocks.
    *   Emphasize the higher risk associated with individual stocks compared to diversified mutual funds.

3. *Investment Advice (Always provide, even if the query is about something else):*
    *   Consider their risk tolerance and time horizon to provide general investment strategies.
    *   Suggest appropriate asset allocation (e.g., for a medium-risk, long-term investor, a mix of equity and debt funds).
    *   Mention the importance of diversification and regular portfolio rebalancing.

4. *Financial Planning (Always provide, even if the query is about something else):*
    *   Factor in their monthly income to suggest appropriate investment amounts and budgeting strategies. Suggest a percentage or range of their income they could consider saving/investing.
    *   Connect financial planning to their stated investment goals. For example, "To achieve your goal of retirement in 20 years, with your current income, you should aim to invest approximately X% of your monthly income."

5. *General Queries (Address if the user asks a specific question, or provide examples proactively):*
    *   Provide educational and informative responses using clear and simple language.
    *   Provide examples of common financial terms like SIP, asset allocation, etc.

6. *Disclaimer (Always include):* State that the information provided is for educational purposes only and does not constitute financial advice. Encourage users to consult with a qualified financial advisor before making any investment decisions.
            `;

            console.log('Generating response with prompt:', prompt);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            console.log('Generated response:', response.text());
            
            return {
                type: 'TEXT',
                message: response.text()
            };
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }

    async analyzeIntent(message) {
        try {
            const prompt = `
            Analyze this financial query: "${message}"
            Return JSON with:
            {
                "type": "INTENT_TYPE",
                "details": "brief description",
                "category": "stocks|mutual_funds|general"
            }
            `;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return JSON.parse(response.text());
        } catch (error) {
            console.error('Error analyzing intent:', error);
            return {
                type: 'GENERAL_QUERY',
                details: 'Failed to analyze intent',
                category: 'general'
            };
        }
    }
}

module.exports = GeminiService;