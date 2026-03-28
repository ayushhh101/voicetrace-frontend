import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecorder } from "../hooks/useRecorder";
import VoiceVisualizer from "../components/VoiceVisualizer";

const VoiceAction = () => {
    const navigate = useNavigate();
    const { startRecording, stopRecording, blob } = useRecorder();

    const [status, setStatus] = useState('idle');
    const [transcript, setTranscript] = useState("");
    const [aiStatus, setAiStatus] = useState("Thinking...");
    const [extractedData, setExtractedData] = useState(null);

    // Engagement: Rotate "Thinking" messages
    useEffect(() => {
        let interval;
        if (status === 'processing' && aiStatus === "Thinking...") {
            const messages = ["Analyzing your voice...", "Extracting numbers...", "Refining text...", "Saving to ledger..."];
            let i = 0;
            interval = setInterval(() => {
                setAiStatus(messages[i % messages.length]);
                i++;
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [status, aiStatus]);

    const handleStart = async () => {
        setTranscript("");
        setExtractedData(null);
        setAiStatus("Thinking...");
        const started = await startRecording();
        if (started) setStatus('recording');
    };

    const handleStop = () => {
        stopRecording();
        setStatus('processing');
    };

    useEffect(() => {
        if (blob && status === 'processing') {
            processStream(blob);
        }
    }, [blob, status]);

    const processStream = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.m4a"); 
        formData.append("lang", "hindi");
        formData.append("meta", JSON.stringify({ userId: "vendor_123", timestamp: Date.now() }));

        try {
            const response = await fetch("http://localhost:8000/api/speech_msg", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n\n");

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const parsed = JSON.parse(line.replace("data: ", ""));

                        // 1. Hook: Show Base Model text immediately
                        if (parsed.status === 'fast_text') {
                            setTranscript(parsed.text);
                            setAiStatus("Refining text with AI...");
                        } 
                        // 2. Hook: Replace with Turbo text
                        if (parsed.status === 'accurate_text_ready') {
                            setTranscript(parsed.text);
                            setAiStatus("Extracting business data...");
                        } 
                        // 3. AI Graph Steps
                        else if (parsed.status && !['fast_text', 'accurate_text_ready'].includes(parsed.status)) {
                            setAiStatus(parsed.status);
                        }

                        // 4. Final Output
                        if (parsed.stage === 'complete') {
                            setExtractedData(parsed.data);
                            setStatus('success');
                        }
                        
                        if (parsed.stage === 'clarification_needed') {
                            setAiStatus(parsed.data);
                        }
                    } catch (e) {
                        console.error("Parse error", e);
                    }
                }
            }
        } catch (error) {
            console.error("Stream failed:", error);
            setStatus('idle');
            setAiStatus("Server disconnected. Please try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#050505] flex flex-col items-center px-8 pt-10 font-sans">
            <div className="relative w-full h-[400px] flex items-center justify-center">
                <div className="absolute w-40 h-40 bg-white/5 blur-[100px] rounded-full" />
                <VoiceVisualizer status={status} />
                {status === 'idle' && (
                    <div className="absolute bottom-10 animate-pulse text-white/40 text-sm font-medium text-center">
                        Tap to start speaking
                    </div>
                )}
            </div>

            <div className="text-center z-10 -mt-10">
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2 uppercase italic">
                    {status === 'idle' && "Ready"}
                    {status === 'recording' && "Listening..."}
                    {status === 'processing' && "Wait..."}
                    {status === 'success' && "Success!"}
                </h1>
                {/* The Engaging Status Text */}
                <p className="text-emerald-400 font-bold text-lg animate-pulse min-h-[1.5rem]">
                    {status === 'processing' ? aiStatus : status === 'recording' ? "बोलिए, मैं सुन रहा हूँ" : "VoiceTrace Business Intelligence"}
                </p>
            </div>

            {/* The Live Transcription Bubble (Transitioning from Base to Turbo) */}
            {(status === 'processing' || status === 'success') && (
                <div className="w-full mt-6 bg-white/5 p-4 rounded-2xl border border-white/10 italic text-white/70 text-sm text-center animate-in fade-in duration-500">
                    "{transcript || "Analyzing sound waves..."}"
                </div>
            )}

            {/* Success Card */}
            {status === 'success' && extractedData && (
                <div className="w-full mt-4 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-emerald-500/10 p-5 rounded-[28px] border border-emerald-500/20 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Entry Logged</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold uppercase">{extractedData.transaction_type}</span>
                        </div>
                        <div className="space-y-3">
                            <DataRow label="Item" value={extractedData.item || "Sale"} />
                            <DataRow label="Amount" value={`₹${extractedData.amount}`} highlight />
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-32 left-0 right-0 px-8 max-w-md mx-auto">
                {status === 'idle' && (
                    <button onClick={handleStart} className="w-full py-6 bg-[#0D6D5D] text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                        <MicIcon className="w-6 h-6" />
                        <span>Tap to Speak</span>
                    </button>
                )}
                {status === 'recording' && (
                    <button onClick={handleStop} className="w-full py-6 bg-red-600 text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                        <span>Finish</span>
                        <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                    </button>
                )}
                {status === 'success' && (
                    <div className="flex gap-3">
                        <button onClick={() => setStatus('idle')} className="flex-1 py-5 bg-white/10 text-white rounded-2xl font-bold">New</button>
                        <button onClick={() => navigate('/')} className="flex-[2] py-5 bg-[#10B981] text-white rounded-2xl font-black shadow-lg">Looks Good</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const DataRow = ({ label, value, highlight }) => (
    <div className="flex justify-between text-sm items-center">
        <span className="text-white/40 font-bold uppercase tracking-tighter text-[10px]">{label}</span>
        <span className={`font-black ${highlight ? 'text-emerald-400 text-xl' : 'text-white'}`}>{value}</span>
    </div>
);

const MicIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export default VoiceAction;