import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Lightbulb, Zap, ShoppingCart } from 'lucide-react';
import { StatCard } from './Home';

const Insights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const vendorId = "69c7ee1bb5546e91df1818eb";

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/home/insights/${vendorId}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Insights Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchInsights();
  }, [vendorId]);

  if (loading) return <div className="p-10 text-center font-bold text-purple-600 animate-pulse mt-20 italic">Generating Weekly Report...</div>;
  
  const insights = data || {};

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32">
      {/* --- Purple Header Section --- */}
      <header className="bg-[#7C3AED] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Weekly<br/>Report</h1>
              <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mt-1">Business Insights</p>
            </motion.div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <StatCard label="Rozana Sales" value={insights.avgDailyIncome || "0"} />
            <StatCard label="Daily Profit" value={insights.avgProfit || "0"} />
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
              <p className="text-[9px] font-bold opacity-70 mb-1 uppercase text-white">Waste</p>
              <p className="text-lg font-black tracking-tight text-white">{insights.wastePercentage || "0"}%</p>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </header>

      <main className="p-5 space-y-8">
        {/* --- Sales Patterns --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">Patterns</h2>
          <div className="space-y-3">
            {insights.bestDays?.length > 0 && (
              <PatternCard 
                icon="📅" 
                title={`${insights.bestDays[insights.bestDays.length - 1].day}s are best!`} 
                sub={`Avg ₹${insights.bestDays[insights.bestDays.length - 1].avgIncome}/day`} 
                bgColor="bg-emerald-50" 
                textColor="text-emerald-700" 
              />
            )}
            {insights.bestTimeOfDay?.length > 0 && (
              <PatternCard 
                icon="🌆" 
                title="Peak Business Hours" 
                sub={insights.bestTimeOfDay[0].time} 
                bgColor="bg-orange-50" 
                textColor="text-orange-700" 
              />
            )}
          </div>
        </section>

        {/* --- Item Performance --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">Item Performance</h2>
          <div className="bg-white p-6 rounded-[32px] shadow-sm space-y-6 border border-slate-50">
            {insights.bestItems?.slice(0, 2).map((item, i) => (
                <PerformanceRow key={i} label={item.item} val={item.revenue} percent="85" tag="Best" tagCol="text-emerald-500 bg-emerald-50" barCol="bg-emerald-500" />
            ))}
            {insights.worstItems?.slice(0, 1).map((item, i) => (
                <PerformanceRow key={i} label={item.item} val={item.waste} percent="30" tag="Worst" tagCol="text-red-500 bg-red-50" barCol="bg-red-400" />
            ))}
          </div>
        </section>

        {/* --- Smart Alerts --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">Alerts</h2>
          <div className="space-y-3">
            {insights.anomalies?.map((anom, i) => (
               <AlertCard 
                key={i}
                icon={anom.message.includes('low') ? "🚨" : "⚠️"} 
                title="Pattern Alert" 
                sub={anom.message} 
                tag="Check"
                color={anom.message.includes('low') ? "red" : "orange"}
              />
            ))}
          </div>
        </section>

        {/* --- Tomorrow's Tips --- */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">Tips for Tomorrow</h2>
          <div className="space-y-3">
            {insights.suggestions?.slice(0, 3).map((sug, i) => (
                <Tip key={i} icon="💡" text={sug.message} bgColor={i % 2 === 0 ? "bg-emerald-50" : "bg-indigo-50"} />
            ))}
            <Tip icon="💳" text={`₹${insights.totalUdharPending} market credit pending.`} bgColor="bg-rose-50" />
          </div>
        </section>
      </main>
    </div>
  );
};

/* --- UI Components (Unchanged UI, just fixed mapping) --- */

const PatternCard = ({ icon, title, sub, bgColor, textColor }) => (
  <div className={`${bgColor} p-4 rounded-3xl flex items-center gap-4 border border-black/5`}>
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">{icon}</div>
    <div>
      <h3 className={`font-black text-sm ${textColor} uppercase tracking-tight`}>{title}</h3>
      <p className="text-[11px] text-slate-500 font-bold">{sub}</p>
    </div>
  </div>
);

const PerformanceRow = ({ label, val, percent, tag, tagCol, barCol }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{label}</span>
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
        <h3 className={`text-${color}-900 font-black text-sm uppercase tracking-tight`}>{title}</h3>
        <p className={`text-${color}-700 text-[10px] font-medium mt-0.5`}>{sub}</p>
      </div>
    </div>
    <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase bg-white border border-${color}-200 text-${color}-500`}>{tag}</span>
  </div>
);

const Tip = ({ icon, text, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-2xl flex items-center gap-4 border border-black/5`}>
    <span className="text-lg">{icon}</span>
    <p className="text-xs font-bold text-slate-700 leading-tight">{text}</p>
  </div>
);

export default Insights;