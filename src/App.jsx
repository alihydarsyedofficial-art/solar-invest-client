import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Deposit from './components/Deposit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/deposit" element={<Layout><Deposit /></Layout>} />
        <Route path="/market" element={<Layout><div>Market</div></Layout>} />
        <Route path="/portfolio" element={<Layout><div>Portfolio</div></Layout>} />
        <Route path="/profile" element={<Layout><div>Profile</div></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;