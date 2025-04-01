// backend/routes/marketRoutes.js
const express = require('express');
const router = express.Router();
const FinancialDataService = require('../services/financialData');

const financialService = new FinancialDataService();

router.get('/indices', async (req, res) => {
    try {
        const [nifty, sensex] = await Promise.all([
            financialService.getNiftyData(),
            financialService.getSensexData()
        ]);
        res.json({ 
            nifty: nifty || { error: 'Failed to fetch Nifty data' }, 
            sensex: sensex || { error: 'Failed to fetch Sensex data' } 
        });
    } catch (error) {
        console.error('Error fetching indices:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/stock/:symbol', async (req, res) => {
    try {
        console.log('Fetching data for symbol:', req.params.symbol);
        const [price, overview] = await Promise.all([
            financialService.getStockPrice(req.params.symbol),
            financialService.getCompanyOverview(req.params.symbol)
        ]);
        console.log('Price data:', price);
        console.log('Overview data:', overview);
        res.json({ price, overview });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;