import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios"; 
// import Recorder from "../components/Recorder"; // Assuming you still need this later

export default function Home() {
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const vendorId = "69c7ee1bb5546e91df1818eb";

  useEffect(() => {
    const fetchData = async () => {
      console.log("🚀 Effect triggered. Fetching for:", vendorId);
      try {
        const res = await axios.get(`http://localhost:5000/api/home/${vendorId}`);
        console.log("✅ Data Received:", res.data);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [vendorId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="animate-pulse font-bold text-emerald-600">Loading Dashboard...</p>
    </div>
  );

  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-28 font-sans">
      {/* --- Top Green Header --- */}
      <header className="bg-[#0D6D5D] p-6 rounded-b-[40px] shadow-lg text-white">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-wider">Today's Earnings</p>
            {/* Mapped Earnings */}
            <h1 className="text-5xl font-black mt-1">₹{data?.stats?.earnings || 0}</h1>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase">Live</span>
          </div>
        </div>

        {/* Stat Cards Mapped */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="PROFIT" value={data?.stats?.profit || 0} />
          <StatCard label="EXPENSES" value={data?.stats?.expenses || 0} />
          <StatCard label="DEBT" value={data?.stats?.debt || 0} />
        </div>
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

        {/* Chips Row Mapped */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {data?.inventorySummary?.map((item, index) => (
            <SummaryChip 
              key={item.id || index} 
              icon={item.icon || "📦"} 
              label={item.label} 
              count={item.count} 
            />
          ))}
        </div>

        {/* Activity Feed Mapped */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Live Activity</h2>
          <div className="space-y-3">
            {data?.activities?.length > 0 ? (
              data.activities.map((activity, index) => (
                <ActivityRow 
                  key={activity.id || index} 
                  icon={activity.icon} 
                  title={activity.title} 
                  sub={activity.sub} 
                  isWarning={activity.isWarning} 
                />
              ))
            ) : (
              <p className="text-center text-sm text-slate-400 italic py-4">No recent activity.</p>
            )}
          </div>
        </section>

        {/* Waste Alert Mapped (Conditional Render) */}
        {data?.wasteAlert && data.wasteAlert.item && (
          <div className="bg-red-50 border border-red-100 p-5 rounded-[30px] flex items-start gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm">🗑️</div>
            <div>
              <h3 className="text-red-800 font-bold text-sm">Waste Alert</h3>
              <p className="text-red-600 text-sm">
                {data.wasteAlert.quantity} {data.wasteAlert.item} wasted — <span className="font-bold">₹{data.wasteAlert.loss} loss</span>
              </p>
              <p className="text-red-400 text-xs mt-1">
                {data.wasteAlert.remaining > 0 
                  ? `${data.wasteAlert.remaining} ${data.wasteAlert.item} remaining — sell fast!` 
                  : "None remaining."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* Internal Components */
export const StatCard = ({ label, value }) => (
  <div className="bg-white/10 p-3 rounded-2xl border border-white/5 text-center">
    <p className="text-[9px] font-bold opacity-70 mb-1">{label}</p>
    <p className="text-lg font-black tracking-tight font-mono">₹{value}</p>
  </div>
);

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