import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Mic, Calendar, HardDrive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MyRecordings = () => {
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingKey, setPlayingKey] = useState(null); // Track active audio
    const { t, i18n } = useTranslation();
    const vendorId = "69c7ee1bb5546e91df1818eb";

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/recordings?userId=${vendorId}`);
                setRecordings(res.data.recordings);
                setLoading(false);
            } catch (err) {
                console.error("Fetch error:", err);
                setLoading(false);
            }
        };
        fetchRecordings();
    }, []);

    const togglePlay = (key) => {
        setPlayingKey(playingKey === key ? null : key);
    };

    const locale = i18n.resolvedLanguage?.startsWith('hi') ? 'hi-IN' : 'en-IN';

    if (loading) return <div className="p-10 text-center font-bold text-emerald-600 animate-pulse">{t('recordings.loading')}</div>;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 font-sans antialiased">
            <header className="bg-[#0D6D5D] p-8 rounded-b-[40px] shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">{t('recordings.title')}</h1>
                    <p className="text-emerald-100/80 text-xs font-bold uppercase tracking-widest mt-1">{t('recordings.subtitle')}</p>
                </div>
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </header>

            <main className="p-5 space-y-4">
                {recordings.length > 0 ? (
                    recordings.map((rec, index) => {
                        const isPlaying = playingKey === rec.key;
                        
                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={rec.key}
                                className={`bg-white p-5 rounded-[30px] shadow-sm border transition-colors duration-300 ${
                                    isPlaying ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-100'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                            isPlaying ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'
                                        } shadow-inner`}>
                                            <Mic size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{t('recordings.note', { number: recordings.length - index })}</h3>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-1">
                                                <Calendar size={10} />
                                                <span>{new Date(rec.lastModified).toLocaleDateString(locale)}</span>
                                                <span className="opacity-30">•</span>
                                                <HardDrive size={10} />
                                                <span>{(rec.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => togglePlay(rec.key)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all ${
                                            isPlaying ? 'bg-rose-500 text-white' : 'bg-[#0D6D5D] text-white'
                                        }`}
                                    >
                                        {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
                                    </button>
                                </div>

                                {/* Inline Audio Player */}
                                <AnimatePresence>
                                    {isPlaying && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 mt-4 border-t border-slate-50">
                                                <audio 
                                                    src={rec.url} 
                                                    controls 
                                                    autoPlay 
                                                    onEnded={() => setPlayingKey(null)}
                                                    className="w-full h-8 accent-emerald-600"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="text-center py-20">
                        <p className="text-slate-400 italic">{t('recordings.noRecordings')}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyRecordings;