import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      {/* মেইন কন্টেন্ট */}
      <div className="flex-1 pb-20">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full max-w-[450px] bg-[#111827] border-t border-[#1e293b] flex justify-around p-3 z-50 shadow-lg">
        {[
          { name: 'Home', path: '/', icon: '🏠' },
          { name: 'Market', path: '/market', icon: '📊' },
          { name: 'Portfolio', path: '/portfolio', icon: '💼' },
          { name: 'Profile', path: '/profile', icon: '👤' }
        ].map((item) => (
          <div 
            key={item.name} 
            onClick={() => navigate(item.path)}
            className={`text-center text-xs cursor-pointer ${location.pathname === item.path ? 'text-green-500' : 'text-[#94a3b8]'}`}
          >
            <span className="text-xl block">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;