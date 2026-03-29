import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mic, TrendingUp } from 'lucide-react';
import StatCard from "../components/StatCard";
import { useTranslation } from "react-i18next";

const Udhar = ({ vendorId = "69c7ee1bb5546e91df1818eb" }) => {
    const [data, setData] = React.useState({ totalPending: 0, people: [] });
    const [loading, setLoading] = React.useState(true);
    const { t } = useTranslation();

    React.useEffect(() => {
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

    // Logic for the Log Card (Count of people who owe money)
    const activeDebtorsCount = data.people.filter(p => p.pendingAmount > 0).length;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32 font-sans antialiased">
            <header className="bg-gradient-to-br from-[#E11D48] to-[#9F1239] p-6 text-white shadow-2xl relative overflow-hidden rounded-b-[50px]">
                <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase">{t('udhar.title')}</h1>
                            <p className="text-rose-200 text-xs font-bold uppercase tracking-widest">{t('udhar.subtitle')}</p>
                        </motion.div>
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <StatCard 
                            label="Total Pending" 
                            value={data.totalPending} 
                            color="red" 
                        />
                        <StatCard
                            label="Log"
                            value={activeDebtorsCount}
                            isCurrency={false}
                            color="red"
                        />
                        <StatCard 
                            label="Status" 
                            value={data.totalPending > 0 ? "Recovery" : "All Clear"} 
                            isCurrency={false} 
                            color={data.totalPending > 0 ? "red" : "emerald"} 
                        />
                    </div>

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
                        {data.people.length > 0 ? (
                            data.people.map((person, idx) => {
                                const isNegative = person.pendingAmount < 0;
                                const isZero = person.pendingAmount === 0;

                                return (
                                    <DebtPerson
                                        key={idx}
                                        initial={person.name ? person.name.charAt(0) : "?"}
                                        name={person.name || "Unknown"}
                                        amount={Math.abs(person.pendingAmount)}
                                        label={isNegative ? "to pay" : "pending"}
                                        time={formatTime(person.lastUpdate)}
                                        isCleared={isZero}
                                        color={isNegative ? "bg-blue-50 text-blue-600" : (idx % 2 === 0 ? "bg-rose-50 text-rose-600" : "bg-orange-50 text-orange-600")}
                                        initialBg={isNegative ? "bg-blue-100 text-blue-700" : (idx % 2 === 0 ? "bg-rose-100 text-rose-700" : "bg-orange-100 text-orange-700")}
                                    />
                                );
                            })
                        ) : (
                            <div className="bg-white p-10 rounded-[32px] text-center shadow-sm border border-dashed border-slate-200">
                                <p className="text-slate-400 text-xs font-bold">Sabka hisab clear hai! ✅</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

const DebtPerson = ({ initial, name, amount, label, time, color, initialBg, isCleared }) => (
    <div className="bg-white p-4 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-all">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl uppercase ${initialBg}`}>
                {initial}
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight capitalize">{name}</h3>
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
                        <p className={`text-lg font-black ${label === "to pay" ? "text-blue-600" : "text-[#9F1239]"}`}>₹{amount}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{label}</p>
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