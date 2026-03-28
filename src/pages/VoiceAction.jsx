import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecorder } from "../hooks/useRecorder";
import { uploadAudio } from "../services/api";

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
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col items-center px-8 pt-20 pb-32 relative overflow-hidden">
      
      {/* 1. Main Visual Circle */}
      <div className="relative mb-12 flex justify-center items-center">
        {/* Animated Rings for Recording */}
        {status === 'recording' && (
          <>
            <div className="absolute w-64 h-64 bg-red-100 rounded-full animate-ping opacity-20" />
            <div className="absolute w-48 h-48 bg-red-50 rounded-full animate-pulse opacity-40" />
          </>
        )}

        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl z-10 
          ${status === 'idle' ? 'bg-[#14B8A6]' : ''}
          ${status === 'recording' ? 'bg-[#EF4444]' : ''}
          ${status === 'processing' ? 'bg-[#8B5CF6]' : ''}
          ${status === 'success' ? 'bg-[#10B981]' : ''}
        `}>
          {status === 'processing' ? (
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : status === 'success' ? (
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <MicIcon className="w-16 h-16 text-white" />
          )}
        </div>
      </div>

      {/* 2. Dynamic Text Header */}
      <div className="text-center space-y-3 mb-8 transition-all">
        <h1 className="text-3xl font-black text-slate-800">
          {status === 'idle' && "Ready to listen"}
          {status === 'recording' && "Listening..."}
          {status === 'processing' && "Thinking..."}
          {status === 'success' && "Done! ✓"}
        </h1>
        <p className="text-slate-400 font-medium">
          {status === 'idle' && "Tap the button below and speak"}
          {status === 'recording' && "Go on, I'm understanding everything"}
          {status === 'processing' && `"${transcript}"`}
          {status === 'success' && "5 teas added — ₹50"}
        </p>
      </div>

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
          <button onClick={handleStart} className="w-full py-5 bg-[#0D6D5D] text-white rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all">
             Start Speaking
          </button>
        )}
        {status === 'recording' && (
          <button onClick={handleStop} className="w-full py-5 bg-[#EF4444] text-white rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all">
             Stop
          </button>
        )}
        {status === 'success' && (
          <div className="flex gap-3">
             <button onClick={() => setStatus('idle')} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Replay</button>
             <button onClick={() => navigate('/')} className="flex-[2] py-4 bg-[#10B981] text-white rounded-2xl font-black shadow-lg">Looks Good</button>
          </div>
        )}
      </div>

      {/* 5. Audio Waveform (Simulated) */}
      {status === 'recording' && (
        <div className="flex items-center gap-1 h-8 mb-10">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="w-1.5 bg-red-400 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%` }} />
          ))}
        </div>
      )}
    </div>
  );
};

const MicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export default VoiceAction;