import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NextDayInsights() {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const vendorId = "69c7ee1bb5546e91df1818eb"; // Hardcoded for now

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const formData = new FormData();
        formData.append("meta", JSON.stringify({ userId: vendorId }));

        const res = await axios.post(`http://localhost:8000/api/next_day_suggestions`, formData);
        setInsights(res.data.suggestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setLoading(false);
      }
    };
    fetchInsights();
  }, [vendorId]);

  const translateDbMessage = (rawValue) => {
    if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
      return rawValue;
    }

    const normalizedKey = rawValue
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");
    const key = `nextDayInsights.db.message.${normalizedKey}`;

    return i18n.exists(key) ? t(key) : rawValue;
  };

  const locale = i18n.resolvedLanguage?.startsWith("hi") ? "hi-IN" : "en-IN";

  // Get tomorrow's date for a more realistic UI header
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString(locale, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* Top App Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 -ml-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
            aria-label={t('nextDayInsights.backAriaLabel')}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">{t('nextDayInsights.appBarTitle')}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* Context Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t('nextDayInsights.title')}</h2>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1 font-medium">
              <Calendar size={14} />
              <span>{dateString}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          // Professional Skeleton Loader instead of a generic spinner
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-5 animate-pulse">
                <div className="flex gap-3 items-start">
                  <div className="h-10 w-10 bg-slate-200 rounded-xl shrink-0"></div>
                  <div className="flex-1">
                     <div className="h-5 bg-slate-200 rounded-md w-2/3 mb-2"></div>
                     <div className="h-3.5 bg-slate-100 rounded-md w-full mb-1.5"></div>
                     <div className="h-3.5 bg-slate-100 rounded-md w-4/5"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, idx) => {
              const lowerInsight = insight.toLowerCase();
              const isWarning =
                lowerInsight.includes("decrease") ||
                lowerInsight.includes("skip") ||
                lowerInsight.includes("reduce") ||
                lowerInsight.includes("unsold") ||
                lowerInsight.includes("waste") ||
                lowerInsight.includes("कम") ||
                lowerInsight.includes("घटा") ||
                lowerInsight.includes("छोड़") ||
                lowerInsight.includes("बचा") ||
                lowerInsight.includes("वेस्ट");
              
              // Safe splitting logic
              const localizedInsight = translateDbMessage(insight);
              const parts = localizedInsight.split('—');
              const itemAction = parts[0]?.trim() || localizedInsight;
              const reason = parts[1]?.trim() || "";

              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-3xl border bg-white shadow-sm relative overflow-hidden ${
                    isWarning ? 'border-amber-100' : 'border-emerald-100'
                  }`}
                >
                  {/* Subtle gradient background blur matching WasteInsights */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
                    isWarning ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                  }`} />
                  
                  <div className="flex items-start gap-3 relative z-10">
                    {/* Icon Container */}
                    <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                      isWarning ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {isWarning ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                    </div>
                    
                    {/* Text Content */}
                    <div>
                      <p className={`font-black leading-snug ${
                        isWarning ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {itemAction}
                      </p>
                      {reason && (
                        <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                          {reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Empty State */}
            {!loading && insights.length === 0 && (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="bg-white w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Info size={20} className="text-slate-400" />
                </div>
                <h3 className="text-slate-700 font-semibold">{t('nextDayInsights.emptyTitle')}</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {t('nextDayInsights.emptyDescription')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}