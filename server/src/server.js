const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for Vue client
app.use(cors({
  origin: 'http://localhost:8080'
}));

// Sample data route
app.get('/api/graph', (req, res) => {
  try {
    const sampleData = require('./data/sample.json');
    res.json(sampleData);
  } catch (error) {
    console.error('Error reading sample data:', error);
    res.status(500).json({ error: 'Failed to load graph data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});