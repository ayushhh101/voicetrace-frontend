import React from "react";
import { useTranslation } from "react-i18next";
import Recorder from "../components/Recorder";
import StatCard from "../components/StatCard";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-28 font-sans">
      {/* --- Top Green Header --- */}
      <header className="bg-[#0D6D5D] p-6 rounded-b-[40px] shadow-lg text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-wider">Today's Earnings</p>
            <h1 className="text-5xl font-black mt-1">₹820</h1>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase">Live</span>
          </div>
        </div>

        {/* Stat Cards */}
        {/* Stat Cards Grid in Home.js */}
        
        <motion.div 
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ 
    type: "spring", 
    stiffness: 260, 
    damping: 20,
    delay: 0.1 
  }}
  className="grid grid-cols-3 gap-3"
>
          {/* The new component handles the 3D tilt and holographic shine! */}
          <StatCard label="PROFIT" value="420" color="emerald" />
          <StatCard label="EXPENSES" value="400" color="blue" />
          <StatCard label="DEBT" value="150" color="red" />
        </motion.div>
      </header>

      {/* --- Main Content --- */}
      <main className="p-4 space-y-6">
        {/* Micro-Interaction/Search Bar Area */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-3 ring-8 ring-emerald-50/50">
            <span className="text-2xl">🎙️</span>
          </div>
          <p className="text-slate-400 text-sm font-medium italic">What did you sell today?</p>
        </div>

        {/* Chips Row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <SummaryChip icon="☕" label="Chai" count="45" />
          <SummaryChip icon="🍌" label="Banana" count="30" />
          <SummaryChip icon="🥜" label="Nuts" count="5" />
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-bold text-sm">₹400</div>
        </div>

        {/* Activity Feed */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Live Activity</h2>
          <div className="space-y-3">
            <ActivityRow icon="☕" title="5 teas sold" sub="₹50 • 2 mins ago" />
            <ActivityRow icon="🍌" title="10 bananas sold" sub="₹80 • 15 mins ago" />
            <ActivityRow icon="💸" title="Transport expenses" sub="₹50 - confirm?" isWarning />
          </div>
        </section>

        {/* Waste Alert */}
        <div className="bg-red-50 border border-red-100 p-5 rounded-[30px] flex items-start gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm">🗑️</div>
          <div>
            <h3 className="text-red-800 font-bold text-sm">Waste Alert</h3>
            <p className="text-red-600 text-sm">5 bananas wasted — <span className="font-bold">₹25 loss</span></p>
            <p className="text-red-400 text-xs mt-1">8 bananas remaining — sell fast!</p>
          </div>
        </div>
      </main>


    </div>
  );
}

/* Internal Components for UI Cleanliness */


export const SummaryChip = ({ icon, label, count }) => (
  <div className="bg-amber-50 text-amber-900 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-sm border border-amber-100 whitespace-nowrap">
    <span>{icon}</span> <span>{label}: {count}</span>
  </div>
);

export const ActivityRow = ({ icon, title, sub, isWarning }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-3xl shadow-sm border border-slate-50">
    <div className="flex gap-4 items-center">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isWarning ? 'bg-red-50' : 'bg-slate-50'}`}>{icon}</div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        <p className={`text-[11px] ${isWarning ? 'text-orange-500 font-bold' : 'text-slate-400'}`}>{sub}</p>
      </div>
    </div>
    <button className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shadow-inner">▶</button>
  </div>
);


