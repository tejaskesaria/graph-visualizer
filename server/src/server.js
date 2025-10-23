const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Enable CORS for Vue client
app.use(cors({
  origin: 'http://localhost:8080'
}));

// Helper function to load JSON data
const loadJsonData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

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

// New data route with fallback
app.get('/api/graph/new', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data', 'new-data.json');
    
    if (fs.existsSync(dataPath)) {
      const newData = loadJsonData('new-data.json');
      res.json(newData);
    } else {
      console.log('new-data.json not found, falling back to sample.json');
      const sampleData = loadJsonData('sample.json');
      res.json(sampleData);
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to load graph data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});