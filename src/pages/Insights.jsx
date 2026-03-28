import React from 'react';
import { StatCard } from './Home'; // Borrowing your StatCard design

const Insights = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32">
      {/* --- Purple Header Section --- */}
      <header className="bg-[#7C3AED] p-6 rounded-b-[40px] text-white shadow-xl">
        <div className="mb-6">
          <p className="text-purple-200 text-[10px] font-bold uppercase tracking-widest">Weekly Report</p>
          <h1 className="text-2xl font-black mt-1">Your Business</h1>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Avg. Daily" value="740" />
          <StatCard label="Avg. Profit" value="380" />
          <div className="bg-white/10 p-3 rounded-2xl border border-white/5 text-center">
            <p className="text-[9px] font-bold opacity-70 mb-1 uppercase text-white">Waste %</p>
            <p className="text-lg font-black tracking-tight font-mono text-white">6.2%</p>
          </div>
        </div>
      </header>

      <main className="p-5 space-y-8">
        {/* --- Sales Patterns --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Patterns</h2>
          <div className="space-y-3">
            <PatternCard 
              icon="📅" 
              title="Weekends are best!" 
              sub="Avg ₹950/day — Sat, Sun" 
              bgColor="bg-emerald-50" 
              textColor="text-emerald-700" 
            />
            <PatternCard 
              icon="🌆" 
              title="Evening time is best!" 
              sub="5–7 PM earns ₹420 average" 
              bgColor="bg-orange-50" 
              textColor="text-orange-700" 
            />
          </div>
        </section>

        {/* --- Item Performance --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Item Performance</h2>
          <div className="bg-white p-6 rounded-[32px] shadow-sm space-y-6 border border-slate-50">
            <PerformanceRow label="Chai" val="3,150" percent="90" tag="Best" tagCol="text-emerald-500 bg-emerald-50" barCol="bg-emerald-500" />
            <PerformanceRow label="Moong" val="910" percent="60" barCol="bg-orange-400" />
            <PerformanceRow label="Kela" val="240" percent="25" tag="Worst" tagCol="text-red-500 bg-red-50" barCol="bg-red-400" />
          </div>
        </section>

        {/* --- Smart Alerts --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Alerts</h2>
          <div className="space-y-3">
            <AlertCard 
              icon="🚨" 
              title="High Expenses Today" 
              sub="₹400 vs normal ₹280 — transport is high" 
              tag="High"
              color="red"
            />
            <AlertCard 
              icon="⚠️" 
              title="Banana waste is increasing" 
              sub="₹125 loss this week — 5 days in a row" 
              tag="Watch"
              color="orange"
            />
          </div>
        </section>

        {/* --- Tomorrow's Tips --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tips for Tomorrow</h2>
          <div className="space-y-3">
            <Tip icon="💡" text="Prepare for 65+ teas — Sunday rush expected" bgColor="bg-emerald-50" />
            <Tip icon="🍌" text="Don't buy more than 10kg bananas — avoid waste" bgColor="bg-orange-50" />
            <Tip icon="💳" text="₹650 credit pending — ask Ramesh" bgColor="bg-indigo-50" />
          </div>
        </section>
      </main>
    </div>
  );
};

/* --- UI Components --- */

const PatternCard = ({ icon, title, sub, bgColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded-3xl flex items-center gap-4 border border-black/5`}>
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">{icon}</div>
    <div>
      <h3 className={`font-black text-sm ${textColor}`}>{title}</h3>
      <p className="text-[11px] text-slate-500 font-medium">{sub}</p>
    </div>
  </div>
);

const PerformanceRow = ({ label, val, percent, tag, tagCol, barCol }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-800">₹{val}</span>
        {tag && <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${tagCol}`}>{tag}</span>}
      </div>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className={`${barCol} h-full rounded-full`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

const AlertCard = ({ icon, title, sub, tag, color }) => (
  <div className={`bg-${color}-50 p-5 rounded-[28px] border border-${color}-100 flex justify-between items-start`}>
    <div className="flex gap-4">
      <span className="text-xl">{icon}</span>
      <div>
        <h3 className={`text-${color}-900 font-black text-sm`}>{title}</h3>
        <p className={`text-${color}-700 text-[10px] font-medium mt-0.5`}>{sub}</p>
      </div>
    </div>
    <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase bg-white border border-${color}-200 text-${color}-500`}>{tag}</span>
  </div>
);

const Tip = ({ icon, text, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-2xl flex items-center gap-4`}>
    <span className="text-lg">{icon}</span>
    <p className="text-xs font-bold text-slate-700 leading-tight">{text}</p>
  </div>
);

export default Insights;