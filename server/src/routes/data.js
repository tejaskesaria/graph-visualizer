const express = require('express');
const router = express.Router();
const sample = require('../data/sample.json');

router.get('/api/data', (req, res) => {
  res.json(sample);
});

module.exports = router;