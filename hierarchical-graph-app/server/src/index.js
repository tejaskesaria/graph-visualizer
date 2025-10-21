const express = require('express');
const cors = require('cors');
const dataRouter = require('./routes/data');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', dataRouter); // dataRouter defines /api/data

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});