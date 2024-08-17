const fs = require('fs');
const { ChromaClient } = require('chromadb'); 
const natural = require('natural');
const tfidf = new natural.TfIdf();
const { v4: uuidv4 } = require('uuid');

const chroma = new ChromaClient({ path: 'http://localhost:8000' });

const generateEmbeddings = (content) => {
    tfidf.addDocument(content);
    const embeddings = tfidf.listTerms(0).map(term => term.tfidf);
    return embeddings;
};

const getOrCreateCollection = async (name) => {
    if (!name) {
        throw new Error('Collection name must be provided');
    }

    try {
        const existingCollection = await chroma.getCollection({ name });
        return existingCollection;
    } catch (error) {
        if (error.message.includes('Collection does not exist')) {
            console.log(`Collection '${name}' does not exist. Creating a new one.`);

            const newCollection = await chroma.createCollection({
                name: name,
                embeddingFunction: {
                    generate: generateEmbeddings
                }
            });
            return newCollection;
        }

        console.error('Error retrieving or creating collection:', error);
        throw error;
    }
};
const embeddingsStore = {};


const storeEmbeddingsInMemory = (assetID, embeddings) => {
    if (!assetID || !embeddings) {
        throw new Error('AssetID and embeddings must be provided');
    }
    embeddingsStore[assetID] = embeddings;
    console.log('Embeddings stored successfully in memory');
};


const processDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        const embeddings = generateEmbeddings(fileContent);
        const assetID = `asset_${uuidv4()}`;
        await storeEmbeddingsInMemory(assetID, embeddings);

        res.json({ assetID });
    } catch (error) {
        console.error('Error processing document:', error);
        res.status(500).json({ error: 'Error processing document' });
    }
};

module.exports = { processDocument, generateEmbeddings, getOrCreateCollection, embeddingsStore};
