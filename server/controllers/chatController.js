const { v4: uuidv4 } = require('uuid');
const { generateEmbeddings, getOrCreateCollection, embeddingsStore } = require('./documentController'); // Import the function

const chatSessions = {};

const manhattanDistance = (vec1, vec2) => {
    if (vec1.length !== vec2.length) {
        throw new Error('Vector dimensions do not match');
    }
    return vec1.reduce((sum, val, i) => sum + Math.abs(val - vec2[i]), 0);
};

const startChat = (req, res) => {
    const { assetID } = req.body;
    console.log('assetid', assetID)
    const chatThreadID = `chat-${assetID}-${Date.now()}`;

    if (!chatSessions[assetID]) {
        chatSessions[assetID] = {};
    }

    chatSessions[assetID][chatThreadID] = { messages: [] };

    res.json({ chatThreadID });
};


const sendMessage = async (req, res) => {
    const { assetID, chatThreadID, message } = req.body;
    console.log('chatThreadID:', chatThreadID);
    console.log('message:', message);
    console.log('assetID:', assetID);

    if (!chatSessions[assetID] || !chatSessions[assetID][chatThreadID]) {
        return res.status(404).json({ error: 'Chat session not found' });
    }

    const chatSession = chatSessions[assetID][chatThreadID];

    try {
        const documentEmbedding = embeddingsStore[assetID];
        
        if (!documentEmbedding) {
            throw new Error('Document embedding not found');
        }

        const messageEmbedding = generateEmbeddings(message);

        if (!messageEmbedding || messageEmbedding.length === 0) {
            throw new Error('Message embedding is invalid');
        }

        console.log('Document embedding:', documentEmbedding);
        console.log('Message embedding:', messageEmbedding); 

        const distance = manhattanDistance(messageEmbedding, documentEmbedding);
        const response = `Distance from document: ${distance}`;

        chatSession.messages.push({ user: message, agent: response });
        res.json({ response });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
    }
};






const getChatHistory = (req, res) => {
    const { chatThreadID } = req.query;
    const assetID = Object.keys(chatSessions).find(id => chatSessions[id][chatThreadID]);

    if (!assetID || !chatSessions[assetID] || !chatSessions[assetID][chatThreadID]) {
        return res.status(404).json({ error: 'Chat session not found' });
    }

    const chatSession = chatSessions[assetID][chatThreadID];
    res.json({ history: chatSession.messages });
};


module.exports = { startChat, sendMessage, getChatHistory };
