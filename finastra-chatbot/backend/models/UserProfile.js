const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    monthlyIncome: { type: Number, required: true },
    monthlySavings: { type: Number, required: true },
    monthlyInvestment: { type: Number, required: true },
    investmentGoals: [{ type: String }],
    riskTolerance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    timeHorizon: {
        type: String,
        enum: ['short', 'medium', 'long'],
        required: true
    },
    investments: [{
        symbol: String,
        quantity: Number,
        purchasePrice: Number,
        purchaseDate: Date
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);