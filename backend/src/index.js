const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT} (Render will route requests here)`);
});
