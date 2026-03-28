import { useRecorder } from "../hooks/useRecorder";
import { uploadAudio } from "../services/api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSpeech } from "../hooks/useSpeech";

export default function Recorder() {
  const { startRecording, stopRecording, audioURL, blob } = useRecorder();
  const { t, i18n } = useTranslation();
  const { isSupported, speakText } = useSpeech();
  const currentLanguage = i18n.resolvedLanguage?.startsWith("hi") ? "hi" : "en";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [detectedText, setDetectedText] = useState("");

  const handleStart = async () => {
    setError("");
    const started = await startRecording();
    if (!started) setError(t("recorder.microphonePermissionError"));
  };

  const handleStop = () => {
    const stopped = stopRecording();
    if (!stopped) setError(t("recorder.noActiveRecording"));
  };

  const speakGuide = () => {
    speakText(t("recorder.vendorGuideText"), currentLanguage);
  };

  const speakResult = () => {
    const textToSpeak = detectedText || uploadedUrl;
    speakText(textToSpeak, currentLanguage);
  };

  const handleUpload = async () => {
    if (!blob) {
      setError(t("recorder.noRecordingYet"));
      return;
    }

    setError("");
    setUploadedUrl("");
    setDetectedText("");

    setLoading(true);
    try {
      const res = await uploadAudio(blob);
      const nextUploadedUrl = res?.data?.url || "";
      const nextDetectedText =
        res?.data?.text || res?.data?.transcript || res?.data?.message || "";

      setUploadedUrl(nextUploadedUrl);
      setDetectedText(nextDetectedText);
    } catch {
      setError(t("recorder.uploadFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <button onClick={handleStart} className="bg-green-500 px-6 py-3 rounded text-white">
        🎤 {t("recorder.start")}
      </button>

      <button onClick={handleStop} className="bg-red-500 px-6 py-3 rounded text-white">
        ⏹ {t("recorder.stop")}
      </button>

      {audioURL && <audio controls src={audioURL} />}

      <button onClick={handleUpload} className="bg-blue-500 px-6 py-3 rounded text-white">
        ⬆ {t("recorder.upload")}
      </button>

      {isSupported && (
        <button onClick={speakGuide} className="bg-amber-500 px-6 py-3 rounded text-black">
          🔊 {t("recorder.speakGuide")}
        </button>
      )}

      {isSupported && (detectedText || uploadedUrl) && (
        <button onClick={speakResult} className="bg-purple-500 px-6 py-3 rounded text-white">
          🔉 {t("recorder.speakResult")}
        </button>
      )}

      {loading && <p>{t("recorder.uploading")}</p>}
      {error && <p>{error}</p>}

      {(uploadedUrl || detectedText) && (
        <div>
          <h3>{t("recorder.resultTitle")}</h3>
          {uploadedUrl && (
            <p>
              <strong>{t("recorder.uploadedUrl")}: </strong>
              {uploadedUrl}
            </p>
          )}
          <p>
            <strong>{t("recorder.detectedText")}: </strong>
            {detectedText || t("recorder.noDetectedText")}
          </p>
        </div>
      )}
    </div>
  );
}