import React, { useState } from 'react';
import axios from 'axios';

function Watchlist() {
  const [input, setInput] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState('');

  const addCoin = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: 'usd',
            ids: input.toLowerCase(),
          },
        }
      );
      if (response.data.length === 0) {
        setError('Coin not found!');
        return;
      }
      setWatchlist([...watchlist, response.data[0]]);
      setInput('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching coin data');
    }
  };

  const removeCoin = (id) => {
    setWatchlist(watchlist.filter((coin) => coin.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Watchlist</h2>
      <input
        type="text"
        placeholder="Enter coin ID (e.g., bitcoin)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addCoin}>Add</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {watchlist.length > 0 && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((coin) => (
              <tr key={coin.id}>
                <td>
                  <img src={coin.image} alt={coin.name} width="25" style={{ verticalAlign: 'middle', marginRight: 10 }} />
                  {coin.name}
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>
                  <button onClick={() => removeCoin(coin.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Watchlist;
