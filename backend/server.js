const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// In-memory watchlist array
let watchlist = [];

// Root route - simple message
app.get('/', (req, res) => {
  res.send('Crypto Tracker backend is running');
});

// Get current watchlist
app.get('/watchlist', (req, res) => {
  res.json(watchlist);
});

// Add coin to watchlist
app.post('/watchlist', (req, res) => {
  const coin = req.body.coin;
  if (!coin) {
    return res.status(400).json({ error: 'Coin is required' });
  }
  // Avoid duplicates
  if (!watchlist.includes(coin)) {
    watchlist.push(coin);
  }
  res.json(watchlist);
});

// Remove coin from watchlist
app.delete('/watchlist/:coin', (req, res) => {
  const coin = req.params.coin;
  watchlist = watchlist.filter(c => c !== coin);
  res.json(watchlist);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
