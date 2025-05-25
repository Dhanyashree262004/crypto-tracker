import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CoinChart({ coinIds }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current coinId to show
  const coinId = coinIds && coinIds.length > 0 ? coinIds[currentIndex] : null;

  useEffect(() => {
    if (!coinId) return;

    async function fetchHistoricalData() {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: 7,
            },
          }
        );

        const prices = res.data.prices;

        const labels = prices.map(price => {
          const date = new Date(price[0]);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const data = prices.map(price => price[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price (USD)`,
              data,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      }
    }

    fetchHistoricalData();
  }, [coinId]);

  function handlePrev() {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? coinIds.length - 1 : prevIndex - 1
    );
  }

  function handleNext() {
    setCurrentIndex(prevIndex =>
      prevIndex === coinIds.length - 1 ? 0 : prevIndex + 1
    );
  }

  if (!coinId) return <p>No coins to display.</p>;
  if (loading) return <p>Loading chart...</p>;
  if (!chartData) return <p>No data available.</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', textAlign: 'center', marginTop: 40 }}>
      <h3>{coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price Last 7 Days</h3>
      <Line data={chartData} />
      <div style={{ marginTop: 10 }}>
        <button onClick={handlePrev} style={{ marginRight: 10 }}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default CoinChart;
