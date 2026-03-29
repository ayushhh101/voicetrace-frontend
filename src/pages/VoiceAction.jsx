import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecorder } from "../hooks/useRecorder";
import VoiceVisualizer from "../components/VoiceVisualizer";
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VoiceAction = () => {
    const navigate = useNavigate();
    const { startRecording, stopRecording, blob } = useRecorder();
    const { t, i18n } = useTranslation();

    const [status, setStatus] = useState('idle');
    const [transcript, setTranscript] = useState("");
    const [aiStatus, setAiStatus] = useState(t('voiceAction.processingMessages.thinking'));
    const [extractedData, setExtractedData] = useState(null);
    const VENDOR_ID = "69c7ee1bb5546e91df1818eb";

    // Engagement: Rotate "Thinking" messages
    useEffect(() => {
        let interval;
        if (status === 'processing' && aiStatus === t('voiceAction.processingMessages.thinking')) {
            const messages = [
                t('voiceAction.processingMessages.analyzing'),
                t('voiceAction.processingMessages.extractingNumbers'),
                t('voiceAction.processingMessages.refiningText'),
                t('voiceAction.processingMessages.savingLedger')
            ];
            let i = 0;
            interval = setInterval(() => {
                setAiStatus(messages[i % messages.length]);
                i++;
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [status, aiStatus, t]);

    const handleStart = async () => {
        setTranscript("");
        setExtractedData(null);
        setAiStatus(t('voiceAction.processingMessages.thinking'));
        const started = await startRecording();
        if (started) setStatus('recording');
    };

    const handleStop = () => {
        stopRecording();
        setStatus('processing');
    };

    const processParallelTask = useCallback(async (audioBlob) => {
        const agentData = new FormData();
        agentData.append("audio", audioBlob, "recording.m4a");
        agentData.append("lang", i18n.resolvedLanguage?.startsWith('hi') ? 'hindi' : 'english');
        agentData.append("meta", JSON.stringify({ userId: "69c7ee1bb5546e91df1818eb", timestamp: Date.now() }));

        const s3Data = new FormData();
        s3Data.append("audio", audioBlob, `recording_${Date.now()}.m4a`);
        s3Data.append("userId", VENDOR_ID);

        try {
            const [agentResponse, s3Response] = await Promise.all([
                fetch("http://localhost:8000/api/speech_msg", { method: "POST", body: agentData }),
                fetch("http://localhost:5000/api/recordings/upload", { method: "POST", body: s3Data })
            ]);

            if (!agentResponse.ok) throw new Error("Agent failed");

            // Handle S3 logging in background (optional)
            const s3Result = await s3Response.json();
            console.log("✅ S3 Backup complete:", s3Result.url);

            // Process AI Agent Stream
            const reader = agentResponse.body.getReader();
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
                            setAiStatus(t('voiceAction.processingMessages.refiningWithAi'));
                        }
                        // 2. Hook: Replace with Turbo text
                        if (parsed.status === 'accurate_text_ready') {
                            setTranscript(parsed.text);
                            setAiStatus(t('voiceAction.processingMessages.extractingBusinessData'));
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
                            setAiStatus(t('voiceAction.processingMessages.clarificationNeeded'));
                            setTranscript("");
                            setTimeout(() => navigate('/home'), 3000);
                        }
                    } catch (e) {
                        console.error("Parse error", e);
                    }
                }
            }
        } catch (error) {
            console.error("Stream failed:", error);
            setStatus('idle');
            setAiStatus(t('voiceAction.processingMessages.serverDisconnected'));
        }
    }, [VENDOR_ID, i18n.resolvedLanguage, navigate, t]);

    useEffect(() => {
        if (blob && status === 'processing') {
            processParallelTask(blob);
        }
    }, [blob, status, processParallelTask]);

    return (
        <div className="max-w-md mx-auto min-h-screen bg-[#050505] flex flex-col items-center px-8 pt-10 font-sans">
            <div className='top-0'>

                <button
                    onClick={() => navigate('/recordings')}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 rounded-[24px] font-bold text-xs border border-white/5 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Calendar size={14} />
                    <span>{t('voiceAction.history')}</span>
                </button>
            </div>
            <div className="relative w-full h-[400px] flex items-center justify-center">
                <div className="absolute w-40 h-40 bg-white/5 blur-[100px] rounded-full" />
                <VoiceVisualizer status={status} />
                {status === 'idle' && (
                    <div className="absolute bottom-10 animate-pulse text-white/40 text-sm font-medium text-center">
                        {t('voiceAction.hintTapStart')}
                    </div>
                )}

            </div>

            <div className="text-center z-10 -mt-10">
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2 uppercase italic">
                    {status === 'idle' && t('voiceAction.heading.idle')}
                    {status === 'recording' && t('voiceAction.heading.recording')}
                    {status === 'processing' && t('voiceAction.heading.processing')}
                    {status === 'success' && t('voiceAction.heading.success')}
                </h1>
                {/* The Engaging Status Text */}
                <p className="text-emerald-400 font-bold text-lg animate-pulse min-h-[1.5rem]">
                    {status === 'processing' ? aiStatus : status === 'recording' ? t('voiceAction.subtitle.recording') : t('voiceAction.subtitle.idle')}
                </p>
            </div>

            {/* The Live Transcription Bubble (Transitioning from Base to Turbo) */}
            {(status === 'processing' || status === 'success') && (
                <div className="w-full mt-6 bg-white/5 p-4 rounded-2xl border border-white/10 italic text-white/70 text-sm text-center animate-in fade-in duration-500">
                    "{transcript || t('voiceAction.transcriptFallback')}"
                </div>
            )}

            {/* Success Card */}
            {status === 'success' && extractedData && (
                <div className="w-full mt-4 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-emerald-500/10 p-5 rounded-[28px] border border-emerald-500/20 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('voiceAction.successCard.entryLogged')}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-bold uppercase">{extractedData.transaction_type}</span>
                        </div>
                        <div className="space-y-3">
                            <DataRow label={t('voiceAction.successCard.item')} value={extractedData.item || t('voiceAction.successCard.defaultSale')} />
                            <DataRow label={t('voiceAction.successCard.amount')} value={`₹${extractedData.amount}`} highlight />
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-32 left-0 right-0 px-8 max-w-md mx-auto">
                {status === 'idle' && (
                    <button onClick={handleStart} className="w-full py-6 bg-[#0D6D5D] text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                        <MicIcon className="w-6 h-6" />
                        <span>{t('voiceAction.cta.tapToSpeak')}</span>
                    </button>

                )}
                {status === 'recording' && (
                    <button onClick={handleStop} className="w-full py-6 bg-red-600 text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                        <span>{t('voiceAction.cta.finish')}</span>
                        <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                    </button>
                )}
                {status === 'success' && (
                    <div className="flex gap-3">
                        <button onClick={() => setStatus('idle')} className="flex-1 py-5 bg-white/10 text-white rounded-2xl font-bold">{t('voiceAction.cta.new')}</button>
                        <button onClick={() => navigate('/home')} className="flex-[2] py-5 bg-[#10B981] text-white rounded-2xl font-black shadow-lg">{t('voiceAction.cta.looksGood')}</button>
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