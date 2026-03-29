import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MessageSquare, ArrowRight, CheckCircle2, X,TrendingUp,AlertTriangle  } from "lucide-react";

/* --- EXPORTED COMPONENTS --- */
export const StatCard = ({ label, value }) => (
  <div className="bg-white/10 p-3 rounded-2xl border border-white/5 text-center">
    <p className="text-[9px] font-bold opacity-70 mb-1 uppercase tracking-tighter">{label}</p>
    <p className="text-lg font-black tracking-tight font-mono">₹{value}</p>
  </div>
);

export const SummaryChip = ({ icon, label, count }) => (
  <div className="bg-amber-50 text-amber-900 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold border border-amber-100 whitespace-nowrap">
    <span>{icon}</span> <span>{label}: {count}</span>
  </div>
);

export const ActivityRow = ({ icon, title, sub, isWarning }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-3xl shadow-sm border border-slate-50 transition-transform active:scale-95">
    <div className="flex gap-4 items-center">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isWarning ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>{icon}</div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm leading-tight">{title}</h3>
        <p className={`text-[11px] ${isWarning ? 'text-orange-500 font-bold' : 'text-slate-400'}`}>{sub}</p>
      </div>
    </div>
    <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center">
        <CheckCircle2 size={14} className="text-emerald-500" />
    </div>
  </div>
);

/* --- MAIN HOME COMPONENT --- */
import React from "react";
import { useTranslation } from "react-i18next";
import Recorder from "../components/Recorder";
import StatCard from "../components/StatCard";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingRec, setProcessingRec] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const vendorId = "69c7ee1bb5546e91df1818eb";

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/home/${vendorId}`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [vendorId]);

  // Function to delete recommendation if AI was wrong
  const handleDismissRecommendation = async () => {
    try {
      // Direct call to your Python cleanup logic
      const formData = new FormData();
      formData.append("meta", JSON.stringify({ userId: vendorId }));
      
      // We use the recommend_msg endpoint which already has cleanup logic
      // or you can hit a dedicated delete endpoint if you have one.
      setData(prev => ({ ...prev, recommendations: [] })); // Optimistic UI update
      
      await axios.post(`http://localhost:8000/api/recommend_msg/cleanup`, formData); // Adjust URL if needed
      await fetchData();
    } catch (error) {
      console.error("Failed to dismiss", error);
      fetchData(); // Reset on error
    }
  };

  const handleSelectRecommendation = async (msg, num) => {
    setProcessingRec(true);
    const formData = new FormData();
    formData.append("lang", "hindi");
    formData.append("meta", JSON.stringify({ userId: vendorId, msg, num }));

    try {
      const response = await fetch("http://localhost:8000/api/recommend_msg", {
        method: "POST",
        body: formData,
      });
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        if (chunk.includes('"stage": "saved"')) {
           setShowSuccess(true);
           setTimeout(() => setShowSuccess(false), 4000);
        }
      }
      
      await fetchData();
      setProcessingRec(false);
    } catch (error) {
      setProcessingRec(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-emerald-600 font-bold italic uppercase tracking-tighter">VoiceTrace...</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-28 font-sans antialiased">
      
      {/* SUCCESS NOTIFICATION POPUP */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 max-w-md mx-auto"
          >
            <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-emerald-400">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} />
                <div>
                  <p className="font-black text-sm uppercase leading-none">Hisaab Logged!</p>
                  <p className="text-[10px] opacity-90 font-bold uppercase tracking-tight mt-1">Transaction saved to DB</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)}><X size={18}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-[#0D6D5D] p-6 rounded-b-[40px] shadow-lg text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-100/80 text-[10px] font-black uppercase tracking-widest">Earnings Today</p>
            <h1 className="text-5xl font-black mt-1">₹{data?.stats?.earnings || 0}</h1>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
            <span className="text-[10px] font-bold uppercase tracking-tighter italic">Live Tracking</span>
          </div>
        </div>
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
          <StatCard label="PROFIT" value={data?.stats?.profit || 0} color="emerald" />
          <StatCard label="EXPENSES" value={data?.stats?.expenses || 0} color="blue" />
          <StatCard label="DEBT" value={data?.stats?.debt || 0} color="red" />
        </motion.div>
      </header>

      <main className="p-4 space-y-6">
        
        {/* --- DYNAMIC INTERACTION AREA --- */}
        <section>
          <AnimatePresence mode="wait">
            {data?.recommendations?.length > 0 ? (
              /* RECOMMENDATION MODE */
              <motion.div 
                key="rec-area"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-indigo-600 p-6 rounded-[35px] shadow-xl text-white relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-indigo-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Confirm Hisaab</span>
                    </div>
                    {/* DISMISS BUTTON */}
                    <button 
                        onClick={handleDismissRecommendation}
                        className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
                    >
                        <X size={14} />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-4 italic">I'm a bit confused, did you mean:</h3>
                  
                  <div className="space-y-2">
                    {data.recommendations[0].msgs.map((msg, i) => (
                      <button 
                        key={i}
                        disabled={processingRec}
                        onClick={() => handleSelectRecommendation(msg, data.recommendations[0].threadId)}
                        className="w-full text-left bg-white/10 hover:bg-white/20 p-4 rounded-2xl border border-white/10 transition-all flex justify-between items-center group active:scale-[0.98]"
                      >
                        <span className="text-xs font-medium pr-2 leading-snug">{msg}</span>
                        <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </motion.div>
            ) : (
              <motion.div 
                key="insights-area"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-4"
              >
                {/* Box 1: Stock to Buy */}
                <div 
                  onClick={() => navigate('/nextday')}
                  className="bg-emerald-50 rounded-[32px] p-6 shadow-sm border border-emerald-100 flex flex-col items-center text-center active:scale-95 transition-all cursor-pointer group"
                >
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-3 shadow-sm text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <TrendingUp size={28} />
                </div>
                <p className="text-emerald-900 font-black uppercase tracking-tight text-sm leading-tight">Stock<br/>Up</p>
                  <p className="text-emerald-600/70 text-[10px] italic mt-1 font-bold">Best Sellers</p>
                </div>

                {/* Box 2: Stock to Avoid */}
                <div 
                  onClick={() => navigate('/wasteinsight')}
                  className="bg-red-50 rounded-[32px] p-6 shadow-sm border border-red-100 flex flex-col items-center text-center active:scale-95 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-3 shadow-sm text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <AlertTriangle size={28} />
                  </div>
                  <p className="text-red-900 font-black uppercase tracking-tight text-sm leading-tight">Watch<br/>Waste</p>
                  <p className="text-red-600/70 text-[10px] italic mt-1 font-bold">Avoid buying</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {data?.inventorySummary?.map((item, index) => (
            <SummaryChip key={index} icon={item.icon} label={item.label} count={item.count} />
          ))}
        </div>

        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Recent Activity</h2>
          <div className="space-y-3">
            {data?.activities?.map((activity, index) => (
              <ActivityRow key={index} {...activity} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}