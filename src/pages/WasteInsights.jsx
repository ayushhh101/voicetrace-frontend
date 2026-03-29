import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Trash2, TrendingDown, AlertOctagon } from "lucide-react";

export default function WasteInsights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorId = "69c7ee1bb5546e91df1818eb"; // Hardcoded for now

  useEffect(() => {
    const fetchWasteInsights = async () => {
      try {
        const formData = new FormData();
        formData.append("meta", JSON.stringify({ userId: vendorId }));

        const res = await axios.post(`http://localhost:8000/api/waste_insights`, formData);
        setInsights(res.data.insights);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch waste insights:", err);
        setLoading(false);
      }
    };
    fetchWasteInsights();
  }, [vendorId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* Top App Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 -ml-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
            aria-label="Go back"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Waste Insights</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* Context Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-red-600">Waste & Loss</h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 font-medium">
              <TrendingDown size={14} />
              <span>See what's eating into your profits</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-red-500 font-bold italic animate-pulse">Calculating recent losses...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, idx) => {
              // Our Python agent formats things like "Item: Advice"
              // Let's split it so we can make the first part bold
              const parts = insight.split(':');
              const title = parts[0];
              const description = parts.length > 1 ? parts.slice(1).join(':') : '';

              // Decide icon based on if it's a general loss warning or a specific item
              const isLossWarning = title.toLowerCase().includes("loss");

              return (
                <div key={idx} className="p-5 rounded-3xl border border-red-100 bg-white shadow-sm relative overflow-hidden">
                  {/* Subtle red gradient background for warning items */}
                  {isLossWarning && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                  )}
                  
                  <div className="flex items-start gap-3 relative z-10">
                    <div className={`p-2 rounded-xl mt-0.5 ${isLossWarning ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {isLossWarning ? <TrendingDown size={18} /> : <Trash2 size={18} />}
                    </div>
                    <div>
                      <p className={`font-black leading-snug ${isLossWarning ? 'text-red-700' : 'text-slate-800'}`}>
                        {title}
                      </p>
                      {description && (
                        <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                          {description.trim()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Empty State */}
            {insights.length === 0 && (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <AlertOctagon size={20} className="text-emerald-500" />
                </div>
                <h3 className="text-slate-700 font-semibold">No waste recorded!</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Your inventory management is perfect.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}