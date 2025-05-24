import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <nav style={{ padding: 20, background: '#282c34', color: 'white' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: 24 }}>
          Crypto Tracker
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
