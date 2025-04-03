import React, { useState } from 'react';
import './App.css';

function App() {
  const [serverTime, setServerTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServerTime = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/clock');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setServerTime(new Date(data.time).toLocaleString());
    } catch (err) {
      setError(
        `Failed to fetch server time: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      console.error('Error fetching server time:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>UruBurger QR Code Menu System</h1>
        <div className="clock-section">
          <h2>Server Clock Test</h2>
          <button
            onClick={fetchServerTime}
            disabled={loading}
            className="fetch-button"
          >
            {loading ? 'Loading...' : 'Fetch Server Time'}
          </button>

          {serverTime && !error && (
            <div className="time-display">
              <h3>Current Server Time:</h3>
              <p>{serverTime}</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
