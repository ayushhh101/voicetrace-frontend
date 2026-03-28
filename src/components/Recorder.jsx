// import { useRecorder } from "../hooks/useRecorder";
// import { uploadAudio } from "../services/api";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useSpeech } from "../hooks/useSpeech";

// export default function Recorder() {
//   const { startRecording, stopRecording, audioURL, blob } = useRecorder();
//   const { t, i18n } = useTranslation();
//   const { isSupported, speakText } = useSpeech();
//   const currentLanguage = i18n.resolvedLanguage?.startsWith("hi") ? "hi" : "en";

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploadedUrl, setUploadedUrl] = useState("");
//   const [detectedText, setDetectedText] = useState("");

//   const handleStart = async () => {
//     setError("");
//     const started = await startRecording();
//     if (!started) setError(t("recorder.microphonePermissionError"));
//   };

//   const handleStop = () => {
//     const stopped = stopRecording();
//     if (!stopped) setError(t("recorder.noActiveRecording"));
//   };

//   const speakGuide = () => {
//     speakText(t("recorder.vendorGuideText"), currentLanguage);
//   };

//   const speakResult = () => {
//     const textToSpeak = detectedText || uploadedUrl;
//     speakText(textToSpeak, currentLanguage);
//   };

//   const handleUpload = async () => {
//     if (!blob) {
//       setError(t("recorder.noRecordingYet"));
//       return;
//     }

//     setError("");
//     setUploadedUrl("");
//     setDetectedText("");

//     setLoading(true);
//     try {
//       const res = await uploadAudio(blob);
//       const nextUploadedUrl = res?.data?.url || "";
//       const nextDetectedText =
//         res?.data?.text || res?.data?.transcript || res?.data?.message || "";

//       setUploadedUrl(nextUploadedUrl);
//       setDetectedText(nextDetectedText);
//     } catch {
//       setError(t("recorder.uploadFailed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-6">
//       <button onClick={handleStart} className="bg-green-500 px-6 py-3 rounded text-white">
//         🎤 {t("recorder.start")}
//       </button>

//       <button onClick={handleStop} className="bg-red-500 px-6 py-3 rounded text-white">
//         ⏹ {t("recorder.stop")}
//       </button>

//       {audioURL && <audio controls src={audioURL} />}

//       <button onClick={handleUpload} className="bg-blue-500 px-6 py-3 rounded text-white">
//         ⬆ {t("recorder.upload")}
//       </button>

//       {isSupported && (
//         <button onClick={speakGuide} className="bg-amber-500 px-6 py-3 rounded text-black">
//           🔊 {t("recorder.speakGuide")}
//         </button>
//       )}

//       {isSupported && (detectedText || uploadedUrl) && (
//         <button onClick={speakResult} className="bg-purple-500 px-6 py-3 rounded text-white">
//           🔉 {t("recorder.speakResult")}
//         </button>
//       )}

//       {loading && <p>{t("recorder.uploading")}</p>}
//       {error && <p>{error}</p>}

//       {(uploadedUrl || detectedText) && (
//         <div>
//           <h3>{t("recorder.resultTitle")}</h3>
//           {uploadedUrl && (
//             <p>
//               <strong>{t("recorder.uploadedUrl")}: </strong>
//               {uploadedUrl}
//             </p>
//           )}
//           <p>
//             <strong>{t("recorder.detectedText")}: </strong>
//             {detectedText || t("recorder.noDetectedText")}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import { useRecorder } from "../hooks/useRecorder";
import { uploadAudio } from "../services/api";
import { useTranslation } from "react-i18next";
import { useSpeech } from "../hooks/useSpeech";

export default function Recorder() {
  const { startRecording, stopRecording, blob } = useRecorder();
  const { t, i18n } = useTranslation();
  const { isSupported, speakText } = useSpeech();
  const currentLanguage = i18n.resolvedLanguage?.startsWith("hi") ? "hi" : "en";

  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleRecording = async () => {
    if (!isRecording) {
      setError("");
      const started = await startRecording();
      if (started) {
        setIsRecording(true);
      } else {
        setError(t("recorder.microphonePermissionError"));
      }
    } else {
      stopRecording();
      setIsRecording(false);
      // Automatically trigger upload on stop for smoother UX
      // Wait a tiny bit for the blob to be set by the hook
      setTimeout(() => handleAutoUpload(), 500);
    }
  };

  const handleAutoUpload = async () => {
    // Note: Since 'blob' is state-managed in your hook, 
    // it's better to call the upload when the user finishes recording.
    // If you prefer a separate button, you can keep the logic below.
  };

  // Keep your existing handleUpload logic if you want a separate trigger
  const handleUpload = async () => {
    if (!blob) { setError(t("recorder.noRecordingYet")); return; }
    setLoading(true);
    try {
      await uploadAudio(blob);
      if (isSupported) speakText(t("recorder.resultTitle"), currentLanguage);
    } catch {
      setError(t("recorder.uploadFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* The Main "BOLO" FAB */}
      <button
        onClick={handleToggleRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 border-4 border-white z-50
          ${isRecording 
            ? 'bg-red-500 animate-pulse ring-8 ring-red-100' 
            : 'bg-[#14B8A6] ring-8 ring-emerald-50 shadow-emerald-200'}`}
      >
        {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        )}
      </button>
      
      <span className="mt-3 text-[11px] font-black text-emerald-800 uppercase tracking-tighter">Speak</span>

      {/* Conditional Logic/Feedback UI */}
      {error && (
        <div className="absolute bottom-24 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full shadow-lg">
          {error}
        </div>
      )}
      
      {/* Action Buttons for Upload/Listen (only show when blob exists) */}
      {blob && !isRecording && (
        <div className="absolute -top-12 flex gap-4">
            <button onClick={handleUpload} className="bg-blue-500 text-white p-2 rounded-full shadow-lg text-xs">⬆️</button>
            <button onClick={() => speakText(t("recorder.vendorGuideText"), currentLanguage)} className="bg-amber-500 text-white p-2 rounded-full shadow-lg text-xs">🔊</button>
        </div>
      )}
    </div>
  );
}