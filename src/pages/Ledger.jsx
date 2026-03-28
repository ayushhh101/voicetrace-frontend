import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Mic } from 'lucide-react';
import { StatCard } from "./Home";

const Ledger = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F9FBFC] pb-32 font-sans antialiased">
      {/* --- Unified Dark Header --- */}
      <header className="bg-[#1A1F2B] p-6 text-white shadow-2xl relative overflow-hidden rounded-b-[50px]">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">Sat 28 March</h1>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Daily Ledger</p>
            </motion.div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
          </div>

          {/* Profit Visualization (Matches Insights proportions) */}
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-sm mb-6">
            <div className="flex justify-between items-end mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Daily Profit</p>
              <p className="text-2xl font-black text-emerald-400">₹420</p>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden flex">
              <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="bg-emerald-500 h-full" />
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-bold">
              <div className="flex items-center gap-1 text-emerald-400">
                <ArrowUpRight size={12} /> <span>Sales: ₹820</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <ArrowDownRight size={12} /> <span>Costs: ₹400</span>
              </div>
            </div>
          </div>

          {/* Unified 4-Column Mini Grid (Vendor Favorites) */}
          <div className="grid grid-cols-4 gap-2">
            <StatCard label="Sales" value="820" />
            <StatCard label="Profit" value="420" />
            <StatCard label="Expense" value="400" />
            <StatCard label="Waste" value="25" />
          </div>
        </div>
      </header>

      <main className="p-5 space-y-8">
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sales Summary</h2>
          <div className="bg-white p-6 rounded-[32px] shadow-sm space-y-6">
            <ProgressItem icon="☕" label="Tea" total="450" sub="45 cups" percent="80" color="bg-emerald-500" />
            <ProgressItem icon="🍌" label="Banana" total="240" sub="30 pcs" percent="60" color="bg-emerald-400" />
            <ProgressItem icon="🥜" label="Nuts" total="130" sub="5 pkts" percent="30" color="bg-emerald-600" />
          </div>
        </section>

        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Expenses</h2>
          <div className="bg-white rounded-[32px] shadow-sm overflow-hidden p-2">
            <ExpenseRow icon="🚌" label="Transport" val="80" />
            <ExpenseRow icon="🛒" label="Raw Material" val="280" />
            <ExpenseRow icon="🔥" label="LPG Gas" val="40" border={false} />
          </div>
        </section>

        {/* Actionable Hinglish Tip [cite: 37] */}
        <section className="bg-amber-50 p-5 rounded-[32px] border border-amber-100 flex items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-xl">🗑️</div>
          <p className="text-[11px] text-amber-800 font-bold leading-tight">
            Aaj ₹20 ka nuksaan (waste) hua hai. Kal kam kela khareedein.
          </p>
        </section>
      </main>
    </div>
  );
};

/* --- Shared Components --- */

const ProgressItem = ({ icon, label, total, sub, percent, color }) => (
  <div className="flex gap-4 items-center">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg shadow-inner">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-sm font-bold text-slate-700">{label}</h3>
        <p className="text-sm font-black text-slate-800">₹{total}</p>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className={`${color} h-full rounded-full transition-all duration-1000`} />
      </div>
      <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{sub}</p>
    </div>
  </div>
);

const ExpenseRow = ({ icon, label, val, border = true }) => (
  <div className={`flex items-center justify-between p-4 ${border ? 'border-b border-slate-50' : ''}`}>
    <div className="flex gap-3 items-center">
      <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center grayscale opacity-70">{icon}</span>
      <span className="text-sm font-bold text-slate-600">{label}</span>
    </div>
    <span className="text-sm font-black text-red-500">-₹{val}</span>
  </div>
);

export default Ledger;