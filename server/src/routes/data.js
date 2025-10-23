const express = require('express');
const router = express.Router();
const sample = require('../data/sample.json');

router.get('/api/data', (req, res) => {
  try {
    if (!sample) {
      throw new Error('Data not found');
    }
    res.json(sample);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;