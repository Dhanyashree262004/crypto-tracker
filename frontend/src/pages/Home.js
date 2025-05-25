// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CoinChart from '../components/CoinChart';

function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    })
    .then(response => {
      setCoins(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching coin data:', error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  function addToWatchlist(coin) {
    if (!watchlist.find(c => c.id === coin.id)) {
      setWatchlist([...watchlist, coin]);
    }
  }

  function removeFromWatchlist(coinId) {
    setWatchlist(watchlist.filter(c => c.id !== coinId));
  }

  if (loading) return <p>Loading...</p>;

  // Prepare list of coin IDs for chart: show watchlist coins or default if empty
  const chartCoinIds = watchlist.length > 0
    ? watchlist.map(coin => coin.id)
    : ['bitcoin', 'ethereum', 'dogecoin'];

  return (
    <div style={{ padding: 20 }}>
      <h2>Top 10 Cryptocurrencies</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price (USD)</th>
            <th>24h Change</th>
            <th>Market Cap</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} width="25" style={{ verticalAlign: 'middle', marginRight: 10 }} />
                {coin.name}
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>
                <button onClick={() => addToWatchlist(coin)}>Add to Watchlist</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Your Watchlist</h2>
      {watchlist.length === 0 && <p>No coins added yet.</p>}
      {watchlist.length > 0 && (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map(coin => (
              <tr key={coin.id}>
                <td>
                  <img src={coin.image} alt={coin.name} width="25" style={{ verticalAlign: 'middle', marginRight: 10 }} />
                  {coin.name}
                </td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td style={{ color: coin.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td>
                  <button onClick={() => removeFromWatchlist(coin.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Chart section */}
      <CoinChart coinIds={watchlist.length > 0 ? watchlist.map(c => c.id) : ['bitcoin', 'ethereum', 'dogecoin']} />

    </div>
  );
}

export default Home;
