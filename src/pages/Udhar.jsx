import React from 'react';

const Udhar = () => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32">
      {/* --- Rose Red Header Section --- */}
      <header className="bg-gradient-to-br from-[#E11D48] to-[#9F1239] p-6 rounded-b-[40px] text-white shadow-xl relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-rose-100 text-[10px] font-bold uppercase tracking-widest">Total Pending</p>
            <h1 className="text-5xl font-black mt-1">₹650</h1>
            <p className="text-rose-200 text-xs font-medium mt-1 uppercase tracking-tight">Pending from 3 people</p>
          </div>
          <div className="text-right">
            <p className="text-rose-200 text-[10px] font-bold uppercase">Received Today</p>
            <p className="text-2xl font-black text-white">₹50</p>
          </div>
        </div>

        {/* Voice Hint Bar */}
        <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 border border-white/10">
          <span className="text-lg">🎙️</span>
          <p className="text-[11px] font-medium text-rose-50 leading-tight">
            Say <span className="font-black italic">"Ramesh returned ₹50"</span> to update
          </p>
        </div>
      </header>

      <main className="p-5">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">People List</h2>
        
        <div className="space-y-3">
          <DebtPerson 
            initial="R" 
            name="Ramesh" 
            amount="200" 
            time="3 days ago" 
            color="bg-rose-50 text-rose-600" 
            initialBg="bg-rose-100 text-rose-700"
          />
          <DebtPerson 
            initial="S" 
            name="Suresh" 
            amount="150" 
            time="1 day ago" 
            color="bg-orange-50 text-orange-600" 
            initialBg="bg-orange-100 text-orange-700"
          />
          <DebtPerson 
            initial="P" 
            name="Priya Di" 
            amount="300" 
            time="Today" 
            color="bg-rose-50 text-rose-600" 
            initialBg="bg-rose-100 text-rose-700"
            isToday
          />
          <DebtPerson 
            initial="V" 
            name="Vinod" 
            amount="0" 
            color="bg-emerald-50 text-emerald-600" 
            initialBg="bg-emerald-100 text-emerald-700"
            isCleared
          />
        </div>
      </main>
    </div>
  );
};

/* --- UI Component --- */

const DebtPerson = ({ initial, name, amount, time, color, initialBg, isToday, isCleared }) => (
  <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between group active:scale-95 transition-all">
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${initialBg}`}>
        {initial}
      </div>
      
      <div>
        <h3 className="font-bold text-slate-800 text-sm leading-tight">{name}</h3>
        {isCleared ? (
          <div className="flex items-center gap-1 mt-1 text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <span>✓</span> Cleared
          </div>
        ) : (
          <div className={`flex items-center gap-1 mt-1 text-[10px] font-black uppercase ${color} px-2 py-0.5 rounded-full w-fit`}>
            <span>⏰</span> {time}
          </div>
        )}
      </div>
    </div>

    <div className="text-right">
      {isCleared ? (
        <span className="text-emerald-500 text-xl font-bold">✓</span>
      ) : (
        <>
          <p className="text-lg font-black text-[#9F1239]">₹{amount}</p>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">pending</p>
        </>
      )}
    </div>
  </div>
);

export default Udhar;