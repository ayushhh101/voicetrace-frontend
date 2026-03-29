import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Navbar = () => {
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-100 px-6 py-4 flex justify-between items-end max-w-md mx-auto z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <NavItem 
        to="/" 
        icon="🏠" 
        label="Ghar" 
        active={isActive('/')} 
      />
      <NavItem 
        to="/ledger" 
        icon="📋" 
        label="Hisaab" 
        active={isActive('/ledger')} 
      />
      
      {/* Central Voice Button */}
      <Link 
  to="/voice" 
  className="relative -mt-10 flex flex-col items-center group transition-transform active:scale-90"
>
  <div className="w-16 h-16 bg-[#14B8A6] rounded-full flex items-center justify-center shadow-2xl border-[6px] border-white ring-1 ring-slate-100">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  </div>
  <span className="mt-2 text-[10px] font-black text-emerald-800 uppercase tracking-tighter">
    Bolo
  </span>
</Link>

      <NavItem 
        to="/insights" 
        icon="📊" 
        label="Report" 
        active={isActive('/insights')} 
      />
      <NavItem 
        to="/udhar" 
        icon="💳" 
        label="Udhar" 
        active={isActive('/udhar')} 
      />
    </nav>
  );
};

// Sub-component for individual Nav links
const NavItem = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
      active ? 'text-emerald-600 scale-110 font-bold' : 'text-slate-300 hover:text-slate-400'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-tighter">
      {label}
    </span>
  </Link>
);

export default Navbar;