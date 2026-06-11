import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Deposit from './components/Deposit';

// ফিউচার পেজগুলোর জন্য ছোট ডামি কম্পোনেন্ট (পরবর্তীতে এগুলো আলাদা ফাইলে তৈরি করবেন)
const Placeholder = ({ title }) => <div className="p-10 text-center text-gray-500">Coming Soon: {title}</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main App Routes with Bottom Navigation */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/deposit" element={<Layout><Deposit /></Layout>} />
        <Route path="/invest" element={<Layout><Home /></Layout>} />
        <Route path="/market" element={<Layout><Placeholder title="Market" /></Layout>} />
        <Route path="/portfolio" element={<Layout><Placeholder title="Portfolio" /></Layout>} />
        <Route path="/profile" element={<Layout><Placeholder title="Profile" /></Layout>} />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;