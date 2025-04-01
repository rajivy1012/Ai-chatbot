// backend/services/financialData.js
const axios = require('axios');

class FinancialDataService {
    constructor() {
        this.apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        this.baseUrl = 'https://www.alphavantage.co/query';
    }

    async getNiftyData() {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: '^NSEI', // Changed symbol for Nifty 50
                    apikey: this.apiKey
                }
            });
            return response.data['Global Quote'];
        } catch (error) {
            console.error('Error fetching Nifty data:', error);
            throw error;
        }
    }

    async getSensexData() {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: '^BSESN', // Changed symbol for Sensex
                    apikey: this.apiKey
                }
            });
            return response.data['Global Quote'];
        } catch (error) {
            console.error('Error fetching Sensex data:', error);
            throw error;
        }
    }

    async getStockPrice(symbol) {
        try {
            // Convert BSE symbol format to Alpha Vantage format
            const formattedSymbol = symbol.replace('.BSE', '.BO');
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: formattedSymbol,
                    apikey: this.apiKey
                }
            });
            return response.data['Global Quote'];
        } catch (error) {
            console.error('Error fetching stock price:', error);
            throw error;
        }
    }

    async getStockTimeSeries(symbol) {
        try {
            const formattedSymbol = symbol.replace('.BSE', '.BO');
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: formattedSymbol,
                    outputsize: 'compact',
                    apikey: this.apiKey
                }
            });
            return response.data['Time Series (Daily)'];
        } catch (error) {
            console.error('Error fetching time series:', error);
            throw error;
        }
    }

    async getCompanyOverview(symbol) {
        try {
            const formattedSymbol = symbol.replace('.BSE', '.BO');
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'OVERVIEW',
                    symbol: formattedSymbol,
                    apikey: this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching company overview:', error);
            throw error;
        }
    }
}

module.exports = FinancialDataService;