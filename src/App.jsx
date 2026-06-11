import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Deposit from './components/Deposit';

function App() {
  return (
    <Router>
      <Routes>
        {/* লগইন এবং রেজিস্ট্রেশন পেজে Bottom Nav থাকবে না */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* বাকি সব পেজে Layout (Bottom Nav) থাকবে */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/deposit" element={<Layout><Deposit /></Layout>} />
        
        {/* আপাতত Invest এবং Profile পেজ তৈরি না থাকায় Home কেই দেখিয়ে রাখছি */}
        <Route path="/invest" element={<Layout><Home /></Layout>} />
        <Route path="/profile" element={<Layout><Home /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;