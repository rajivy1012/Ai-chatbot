const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['stock', 'mutualFund', 'etf', 'bond'],
        required: true
    },
    risk: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    expectedReturn: Number,
    minimumInvestment: Number,
    description: String,
    sector: String,
    historicalPerformance: [{
        date: Date,
        value: Number
    }]
});

module.exports = mongoose.model('Investment', investmentSchema);