const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());

// Root route handler — responds to GET /
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Your existing API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
