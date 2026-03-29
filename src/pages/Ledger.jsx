import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Mic } from 'lucide-react';
import StatCard from '../components/StatCard';
import { 
  Pizza, 
  Beef, 
  CupSoda, 
  Hamburger,
  Sandwich,
  Ham, 
  ShoppingBasket, 
  Truck, 
  Flame, 
  Banknote, 
  UtensilsCrossed 
} from 'lucide-react';

const Ledger = ({ vendorId, selectedDate = "2026-03-27" }) => {
    const [data, setData] = React.useState(null);

    // ADD THIS FETCH LOGIC
    React.useEffect(() => {
        // Replace 5000 with your actual backend port

        const testId = "69c7ee1bb5546e91df1818eb";
        const backendUrl = `http://localhost:5000/api/ledger/daily?vendorId=${testId}&date=${selectedDate}`;

        fetch(backendUrl)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(json => setData(json))
            .catch(err => console.error("Fetch error:", err));
    }, [vendorId, selectedDate]);

    console.log("Fetched Ledger Data:", data);
const getSaleIcon = (name) => {
    const item = name.toLowerCase();
    if (item.includes('pizza')) return <Pizza size={20} className="text-orange-500" />;
    if (item.includes('burger')) return <Hamburger size={20} className="text-amber-600" />;
    if (item.includes('coke') || item.includes('cola')) return <CupSoda size={20} className="text-red-500" />;
    if (item.includes('sandwich')) return <Sandwich size={20} className="text-yellow-600" />;
    return <UtensilsCrossed size={20} className="text-slate-400" />;
};

const getExpenseIcon = (type) => {
    const exp = String(type).toLowerCase();
    if (exp.includes('transport')) return <Truck size={18} />;
    if (exp.includes('raw') || exp.includes('material')) return <ShoppingBasket size={18} />;
    if (exp.includes('gas')) return <Flame size={18} />;
    return <Banknote size={18} />;
};
    // Add a quick guard so it doesn't crash while loading
    if (!data) return <div className="text-white p-10">Loading...</div>;

    if (data.message || !data.summary) {
        return (
            <div className="max-w-md mx-auto min-h-screen bg-[#1A1F2B] flex flex-col items-center justify-center p-10 text-center">
                <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
                    <p className="text-emerald-400 font-bold">No records found for today.</p>
                    <p className="text-slate-400 text-xs mt-2">Try recording your first sale via the Mic!</p>
                </div>
            </div>
        );
    }

    // Destructure for easier use below
    const { summary, salesItems = [], expenseItems = [], tips = [] } = data;
    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#F9FBFC] pb-32 font-sans antialiased">
            {/* --- Unified Dark Header --- */}
            <header className="bg-[#1A1F2B] p-6 text-white shadow-2xl relative overflow-hidden rounded-b-[50px]">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                                {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </h1>
                            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Daily Ledger</p>
                        </motion.div>
                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                            <TrendingUp className="text-emerald-400" size={24} />
                        </div>
                    </div>

                    {/* Profit Visualization (Matches Insights proportions) */}
                    {/* Inside the Profit Visualization section of Ledger.jsx */}
                    <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 backdrop-blur-sm mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Profit</p>
                            <p className="text-2xl font-black text-emerald-400">₹{summary.profit}</p>
                        </div>

                        {/* MAIN BAR CONTAINER */}
                        <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden relative border border-white/5">

                            {/* THE LIQUID FILL */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(summary.profit / (summary.sales || 1)) * 100}%` }} // Set this dynamically based on your profit %
                                className="bg-emerald-500 h-full relative bar-glow"
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                                {/* THE MOVING LIGHT WAVE LAYER */}
                                <div className="absolute inset-0 liquid-wave opacity-50" />

                                {/* TOP REFLECTION LINE */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
                            </motion.div>
                        </div>

                        <div className="flex justify-between mt-3 text-[10px] font-bold">
                            <div className="flex items-center gap-1 text-emerald-400">
                                <ArrowUpRight size={12} /> <span>Sales: ₹{summary.sales}</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-400">
                                <ArrowDownRight size={12} /> <span>Costs: ₹{summary.expenses}</span>
                            </div>
                        </div>
                    </div>

                    {/* Unified 4-Column Mini Grid (Vendor Favorites) */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.1
                        }}
                        className="grid grid-cols-4 gap-1.5 px-0"
                    >
                        <StatCard label="Sales" value={summary.sales} />
                        <StatCard label="Profit" value={summary.profit} />
                        <StatCard label="Expense" value={summary.expenses} />
                        <StatCard label="Waste" value={summary.waste} />
                    </motion.div>
                </div>
            </header >

            <main className="p-5 space-y-8">
                <section>
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sales Summary</h2>
                    <div className="bg-white p-6 rounded-[32px] shadow-sm space-y-6">
                        {salesItems.map((item, idx) => (
                            <ProgressItem
                                key={idx}
                                icon={getSaleIcon(item.item)}
                                label={item.item}
                                total={item.total}
                                sub={`${item.quantity} units`}
                                percent={(item.total / (summary.sales || 1)) * 100}
                                color="bg-emerald-500"
                            />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Expenses</h2>
                    <div className="bg-white rounded-[32px] shadow-sm overflow-hidden p-2">
                        {expenseItems && expenseItems.length > 0 ? (
                            expenseItems.map((exp, idx) => (
                                <ExpenseRow
                                    key={idx}
                                    // Use 'type' and 'total' as mapped in updateDailyRecord
                                    icon={getExpenseIcon(exp.type)}
                                    label={exp.type}
                                    val={exp.total}
                                    border={idx !== expenseItems.length - 1}
                                />
                            ))
                        ) : (
                            <p className="p-4 text-center text-slate-400 text-xs">No expenses logged.</p>
                        )}
                    </div>
                </section>

                {/* Actionable Hinglish Tip [cite: 37] */}
                {tips && tips.length > 0 && (
                    <section className="bg-amber-50 p-5 rounded-[32px] border border-amber-100 flex items-center gap-4">
                        <div className="bg-amber-100 p-2 rounded-xl">🗑️</div>
                        <p className="text-[11px] text-amber-800 font-bold leading-tight">
                            {tips[0].message}
                        </p>
                    </section>
                )}
            </main>
        </div >
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