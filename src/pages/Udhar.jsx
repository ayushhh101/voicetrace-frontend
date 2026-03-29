import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mic, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import StatCard from "../components/StatCard";

const Udhar = ({ vendorId = "69c7ee1bb5546e91df1818eb" }) => {
    const [data, setData] = React.useState({ totalPending: 0, people: [] });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Replace with your actual backend URL
        fetch(`http://localhost:5000/api/udhar/summary?vendorId=${vendorId}`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Udhar fetch error:", err);
                setLoading(false);
            });
    }, [vendorId]);

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Today";
        if (diff === 1) return "Yesterday";
        return `${diff} days ago`;
    };

    if (loading) return <div className="text-rose-600 p-10 text-center font-bold">Loading Udhar...</div>;




    const { t, i18n } = useTranslation();

  const people = [
    {
      initial: 'R',
      name: 'Ramesh',
      amount: '200',
      time: '3 days ago',
      color: 'bg-rose-50 text-rose-600',
      initialBg: 'bg-rose-100 text-rose-700'
    },
    {
      initial: 'S',
      name: 'Suresh',
      amount: '150',
      time: '1 day ago',
      color: 'bg-orange-50 text-orange-600',
      initialBg: 'bg-orange-100 text-orange-700'
    },
    {
      initial: 'P',
      name: 'Priya Di',
      amount: '300',
      time: 'Today',
      color: 'bg-rose-50 text-rose-600',
      initialBg: 'bg-rose-100 text-rose-700'
    },
    {
      initial: 'V',
      name: 'Vinod',
      amount: '0',
      color: 'bg-emerald-50 text-emerald-600',
      initialBg: 'bg-emerald-100 text-emerald-700',
      isCleared: true
    }
  ];

  const translateDbValue = (prefix, rawValue) => {
    if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
      return rawValue;
    }

    const normalizedKey = rawValue
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_');
    const lookupKey = `${prefix}.${normalizedKey}`;

    return i18n.exists(lookupKey) ? t(lookupKey) : rawValue;
  };

  return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32 font-sans antialiased">
            {/* --- Unified Rose Header --- */}
            <header className="bg-gradient-to-br from-[#E11D48] to-[#9F1239] p-6 text-white shadow-2xl relative overflow-hidden rounded-b-[50px]">
                <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase">{t('udhar.title')}</h1>
                            <p className="text-rose-200 text-xs font-bold uppercase tracking-widest">{t('udhar.subtitle')}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>

          {/* Unified 3-Column Stat Grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <StatCard label="Total Pending" value="650" />
            <StatCard label="Aaj Mila" value="50" />
            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center backdrop-blur-sm">
              <p className="text-[9px] font-bold opacity-70 mb-1 uppercase text-white">Log</p>
              <p className="text-lg font-black tracking-tight text-white">3</p>
            </div>
          </div>

          {/* Core Voice Hint [cite: 30] */}
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-black/30 backdrop-blur-xl p-4 rounded-3xl flex items-center gap-4 border border-white/10 shadow-lg"
          >
            <div className="bg-rose-500 p-2 rounded-full animate-pulse">
              <Mic size={20} className="text-white" />
            </div>
            <p className="text-[11px] font-bold text-rose-50 italic leading-tight">
              "Ramesh ne 50 rupaye diye" to update
            </p>
          </motion.div>
        </div>
      </header>

      <main className="p-5 space-y-8">
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">People List</h2>
          <div className="space-y-3">
            <DebtPerson 
              initial="R" name="Ramesh" amount="200" time="3 days ago" 
              color="bg-rose-50 text-rose-600" initialBg="bg-rose-100 text-rose-700"
            />
            <DebtPerson 
              initial="S" name="Suresh" amount="150" time="1 day ago" 
              color="bg-orange-50 text-orange-600" initialBg="bg-orange-100 text-orange-700"
            />
            <DebtPerson 
              initial="P" name="Priya Di" amount="300" time="Today" 
              color="bg-rose-50 text-rose-600" initialBg="bg-rose-100 text-rose-700"
            />
            <DebtPerson 
              initial="V" name="Vinod" amount="0" 
              color="bg-emerald-50 text-emerald-600" initialBg="bg-emerald-100 text-emerald-700"
              isCleared
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const DebtPerson = ({ initial, name, amount, time, color, initialBg, isCleared }) => (
  <div className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${initialBg}`}>
        {initial}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-sm leading-tight">{name}</h3>
        <div className={`flex items-center gap-1 mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${isCleared ? 'text-emerald-500 bg-emerald-50' : color}`}>
          {isCleared ? '✓ Cleared' : `⏰ ${time}`}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right mr-2">
        {isCleared ? (
          <span className="text-emerald-500 text-xl font-bold">✓</span>
        ) : (
          <>
            <p className="text-lg font-black text-[#9F1239]">₹{amount}</p>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">pending</p>
          </>
        )}
      </div>
      {!isCleared && (
        <div className="flex flex-col gap-1 border-l pl-3 border-slate-100">
          <MessageCircle size={18} className="text-emerald-500" />
          <Phone size={18} className="text-blue-500" />
        </div>
      )}
    </div>
  </div>
);

export default Udhar;