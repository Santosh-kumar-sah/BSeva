const express = require('express');
const router = express.Router();
const aiController = require('./ai.controller');

// Public AI Assistant Chat Route
router.post('/chat', aiController.handleChat);

// Contextual Starter Suggestions
router.get('/suggest', aiController.getSuggestions);

module.exports = router;
