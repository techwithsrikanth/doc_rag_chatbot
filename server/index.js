const express = require('express');
const bodyParser = require('body-parser');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.json());
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
