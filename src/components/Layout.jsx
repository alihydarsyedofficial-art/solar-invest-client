import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="max-w-md mx-auto bg-gray-900 min-h-screen relative flex flex-col shadow-2xl">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 w-full bg-gray-800 border-t border-gray-700 flex justify-around p-3 text-gray-400 text-sm z-50 rounded-t-xl">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-green-400' : 'hover:text-white'}`}>
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/invest" className={`flex flex-col items-center ${location.pathname === '/invest' ? 'text-green-400' : 'hover:text-white'}`}>
          <span className="text-xl">☀️</span>
          <span>Invest</span>
        </Link>
        <Link to="/deposit" className={`flex flex-col items-center ${location.pathname === '/deposit' ? 'text-green-400' : 'hover:text-white'}`}>
          <span className="text-xl">💳</span>
          <span>Wallet</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${location.pathname === '/profile' ? 'text-green-400' : 'hover:text-white'}`}>
          <span className="text-xl">👤</span>
          <span>Profile</span>
        </Link>
      </div>

    </div>
  );
};

export default Layout;