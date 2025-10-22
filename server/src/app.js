const express = require('express');
const cors = require('cors');
const dataRouter = require('./routes/data');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', dataRouter);

module.exports = app;