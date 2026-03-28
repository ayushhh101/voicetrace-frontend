import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecorder } from "../hooks/useRecorder";
import { uploadAudio } from "../services/api";
import VoiceVisualizer from "../components/VoiceVisualizer";

const VoiceAction = () => {
    const navigate = useNavigate();
    const { startRecording, stopRecording, blob } = useRecorder();

    // States: 'idle' | 'recording' | 'processing' | 'success'
    const [status, setStatus] = useState('idle');
    const [transcript, setTranscript] = useState("");

    const handleStart = async () => {
        const started = await startRecording();
        if (started) setStatus('recording');
    };

    const handleStop = async () => {
        stopRecording();
        setStatus('processing');

        // Simulating API delay for the "Samajh raha hoon" state
        setTimeout(() => {
            setTranscript("Paanch chai bech di, ₹50 mila");
            setStatus('success');
        }, 3000);
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#050505] flex flex-col items-center px-8 pt-10">

            {/* THE SPHERE CONTAINER */}
            <div className="relative w-full h-[400px] flex items-center justify-center">
                {/* Blur glow behind the sphere for depth */}
                <div className="absolute w-40 h-40 bg-white/5 blur-[100px] rounded-full" />

                <VoiceVisualizer status={status} />

                {/* "Tap to speak" overlay only when idle */}
                {status === 'idle' && (
                    <div className="absolute bottom-10 animate-pulse text-white/40 text-sm font-medium">
                        Tap to start speaking
                    </div>
                )}
            </div>

            {/* Dynamic Text Section */}
            <div className="text-center z-10 -mt-10">
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                    {status === 'idle' && "Ready"}
                    {status === 'recording' && "Listening..."}
                    {status === 'processing' && "Thinking..."}
                    {status === 'success' && "Got it!"}
                </h1>
                <p className="text-white/50 text-lg">
                    {status === 'processing' ? "Analyzing your request..." : "I'm all ears"}
                </p>
            </div>

            {/* {status === 'recording' && (
  <div className="flex items-end gap-1.5 h-12 mb-10">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div 
        key={i} 
        className="w-2 bg-emerald-400 rounded-full animate-pulse" 
        style={{ 
          height: `${Math.floor(Math.random() * 60) + 40}%`,
          animationDelay: `${i * 0.1}s` 
        }} 
      />
    ))}
  </div>
)} */}

            {/* 3. Success Details Card */}
            {status === 'success' && (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-500 text-sm text-center">
                        "Paanch chai bech di, ₹50 mila"
                    </div>
                    <div className="bg-emerald-50/50 p-5 rounded-[28px] border border-emerald-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-emerald-600 uppercase">I Understood</span>
                            <span className="text-xs">☕ Chai</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold">Item</span><span className="font-black text-slate-800">Chai</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold">Quantity</span><span className="font-black text-slate-800">5 cups</span></div>
                            <div className="flex justify-between text-sm"><span className="text-slate-400 font-bold">Amount</span><span className="font-black text-emerald-600">₹50</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Bottom Action Button */}
            <div className="fixed bottom-32 left-0 right-0 px-8 max-w-md mx-auto">
                {status === 'idle' && (
                    <button onClick={handleStart} className="w-full py-6 bg-[#0D6D5D] text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                        <MicIcon className="w-6 h-6" /> {/* Optional: Use that MicIcon here too */}
                        <span>Start Speaking</span>
                    </button>
                )}
                {status === 'recording' && (
                    <button onClick={handleStop} className="w-full py-6 bg-[#EF4444] text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                        <span>Stop Recording</span>
                        <div className="w-4 h-4 bg-white rounded-sm animate-pulse" /> {/* Pulsing stop square */}
                    </button>
                )}
                {status === 'success' && (
                    <div className="flex gap-3 animate-[slideUp_0.4s_ease-out]">
                        <button onClick={() => setStatus('idle')} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Replay</button>
                        <button onClick={() => navigate('/')} className="flex-[2] py-4 bg-[#10B981] text-white rounded-2xl font-black shadow-lg">Looks Good</button>
                    </div>
                )}
            </div>

            {/* 5. Audio Waveform (Simulated) */}
            {status === 'recording' && (
                <div className="flex items-center gap-1 h-8 mb-10">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="w-1.5 bg-red-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                </div>
            )}
            <style>
                {`
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-slide-up {
    animation: slideUp 0.4s ease-out forwards;
  }
`}
            </style>

        </div>
    );
};

const MicIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);


export default VoiceAction;