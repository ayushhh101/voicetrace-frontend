import React from 'react';
import { StatCard } from "./Home";

const Ledger = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F9FBFC] pb-32">
      {/* --- Dark Header Section --- */}
      <header className="bg-[#1A1F2B] p-6 rounded-b-[40px] text-white shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Daily Ledger</p>
            <h1 className="text-2xl font-black mt-1">28 March, Saturday</h1>
          </div>
          <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">75 items</span>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Sales" value="820" />
          <StatCard label="Profit" value="420" />
          <StatCard label="Expense" value="400" />
          <StatCard label="Waste" value="25" />
        </div>
      </header>

      <main className="p-5 space-y-8">
        {/* --- Sales Summary Section --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sales Summary</h2>
          <div className="bg-white p-5 rounded-[32px] shadow-sm space-y-6">
            <ProgressItem icon="☕" label="Tea" total="450" sub="45 cups" percent="80" color="bg-emerald-500" />
            <ProgressItem icon="🍌" label="Banana" total="240" sub="30 pcs" percent="60" color="bg-emerald-400" />
            <ProgressItem icon="🥜" label="Nuts" total="130" sub="5 pkts" percent="30" color="bg-emerald-600" />
          </div>
        </section>

        {/* --- Expenses Section --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Expenses</h2>
          <div className="bg-white rounded-[32px] shadow-sm overflow-hidden">
            <ExpenseRow icon="🚌" label="Transport" val="80" />
            <ExpenseRow icon="🛒" label="Raw Material" val="280" />
            <ExpenseRow icon="🔥" label="LPG Gas" val="40" border={false} />
          </div>
        </section>

        {/* --- Sales Trends (Chart) --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sales Timing</h2>
          <div className="bg-white p-6 rounded-[32px] shadow-sm">
            <div className="flex items-end justify-around h-32 mb-4">
              <Bar height="h-16" label="Morning" val="₹180" color="bg-orange-400" />
              <Bar height="h-8" label="Afternoon" val="₹70" color="bg-orange-200" />
              <Bar height="h-24" label="Evening" val="₹570" color="bg-emerald-500" />
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl flex items-center gap-3">
              <span className="text-lg">🍇</span>
              <p className="text-[11px] text-emerald-800 font-bold">Evening best time — earned ₹570</p>
            </div>
          </div>
        </section>

        {/* --- Waste & Stock --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-[28px] border border-red-100">
            <p className="text-lg mb-1">🗑️</p>
            <p className="text-sm font-black text-red-800">5 Bananas</p>
            <p className="text-[10px] text-red-600 font-medium">Waste — ₹20 loss</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-[28px] border border-amber-100">
            <p className="text-lg mb-1">📦</p>
            <p className="text-sm font-black text-amber-800">8 Bananas</p>
            <p className="text-[10px] text-amber-600 font-medium">Left — sell tomorrow</p>
          </div>
        </div>

        {/* --- Credit/Debt Summary --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Credit Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-[28px] text-center shadow-sm">
              <p className="text-[9px] font-bold text-red-400 uppercase mb-1">Given</p>
              <p className="text-xl font-black text-slate-800">₹150</p>
            </div>
            <div className="bg-white p-4 rounded-[28px] text-center shadow-sm">
              <p className="text-[9px] font-bold text-emerald-400 uppercase mb-1">Received</p>
              <p className="text-xl font-black text-slate-800">₹50</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* --- Sub-Components --- */

const StatMini = ({ label, val, color }) => (
  <div className="bg-white/5 p-2 rounded-xl text-center border border-white/5">
    <p className={`text-sm font-black ${color}`}>₹{val}</p>
    <p className="text-[8px] font-bold uppercase opacity-40">{label}</p>
  </div>
);

const ProgressItem = ({ icon, label, total, sub, percent, color }) => (
  <div className="flex gap-4 items-center">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-sm font-bold text-slate-700">{label}</h3>
        <p className="text-sm font-black text-slate-800">₹{total}</p>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-[10px] text-slate-400 mt-1 font-medium">{sub}</p>
    </div>
  </div>
);

const ExpenseRow = ({ icon, label, val, border = true }) => (
  <div className={`flex items-center justify-between p-4 ${border ? 'border-b border-slate-50' : ''}`}>
    <div className="flex gap-3 items-center">
      <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center grayscale opacity-70">{icon}</span>
      <span className="text-sm font-bold text-slate-600">{label}</span>
    </div>
    <span className="text-sm font-black text-red-400">-₹{val}</span>
  </div>
);

const Bar = ({ height, label, val, color }) => (
  <div className="flex flex-col items-center gap-2">
    <p className="text-[9px] font-bold text-slate-400">{val}</p>
    <div className={`${color} w-10 ${height} rounded-t-lg transition-all duration-500`} />
    <p className="text-[10px] font-bold text-slate-500">{label}</p>
  </div>
);

export default Ledger;