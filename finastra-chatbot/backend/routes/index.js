// backend/routes/index.js
const express = require('express');
const router = express.Router();
const ChatService = require('../services/chatService');
const UserProfile = require('../models/UserProfile');

const chatService = new ChatService();

// Profile routes
router.post('/profile', async (req, res) => {
    try {
        console.log('Received profile data:', req.body);
        const profile = new UserProfile(req.body);
        const savedProfile = await profile.save();
        console.log('Saved profile:', savedProfile);
        res.json(savedProfile);
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/profile/:userId', async (req, res) => {
    try {
        console.log('Fetching profile for userId:', req.params.userId);
        const profile = await UserProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            console.log('Profile not found for userId:', req.params.userId);
            return res.status(404).json({ error: 'Profile not found' });
        }
        console.log('Found profile:', profile);
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// Chat route
router.post('/chat', async (req, res) => {
    try {
        console.log('Received chat request:', req.body);
        const { message, userId } = req.body;
        
        const userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            console.log('Profile not found for chat request userId:', userId);
            return res.status(404).json({ error: 'User profile not found' });
        }

        const response = await chatService.processMessage(message, userProfile);
        console.log('Chat response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ error: 'Error processing chat message' });
    }
});

// backend/routes/index.js
router.post('/profile/:userId/investments', async (req, res) => {
    try {
        const { userId } = req.params;
        const { symbol, quantity, purchasePrice, purchaseDate } = req.body;

        const profile = await UserProfile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        profile.investments.push({
            symbol,
            quantity,
            purchasePrice,
            purchaseDate
        });

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error('Error adding investment:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;