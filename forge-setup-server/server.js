require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Intelligent Database Connection Setup
async function connectDatabase() {
  try {
    // Try cloud connection first if it exists
    if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('localhost')) {
      console.log('Attempting connection to MongoDB Atlas...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB Atlas successfully!');
    } else {
      throw new Error('No cloud URI, switching to local backup.');
    }
  } catch (err) {
    console.log('Cloud database blocked or unavailable. Launching local In-Memory Database...');
    
    // Spin up an isolated, local in-memory database
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('Connected to local In-Memory MongoDB successfully! 🚀 (Network bypass active)');
  }
}

connectDatabase();

// Routes
const onboardRoutes = require('./routes/onboard');
app.use('/api/onboard', onboardRoutes);

// Server Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});