require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const logger = require('./middleware/logger');
const responseRoutes = require('./routes/responseRoutes');
const postDataRoutes = require('./routes/postDataRoutes');

const app = express();

app.use(cors()); 

app.use(express.json());
app.use(logger);

app.use('/ai-response', responseRoutes);
app.use('/api', postDataRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});

const { listenToStream } = require('./redis/streamListener');
listenToStream();
