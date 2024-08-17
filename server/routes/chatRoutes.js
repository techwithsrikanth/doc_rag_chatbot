const express = require('express');
const { startChat, sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/start', startChat);
router.post('/message', sendMessage);
router.get('/history', getChatHistory);

module.exports = router;
