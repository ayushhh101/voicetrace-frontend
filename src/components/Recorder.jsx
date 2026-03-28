import { useRecorder } from "../hooks/useRecorder";
import { uploadAudio } from "../services/api";
import { useState } from "react";

export default function Recorder() {
  const { startRecording, stopRecording, audioURL, blob } = useRecorder();
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!blob) return;

    setLoading(true);
    const res = await uploadAudio(blob);
    setLoading(false);

    alert("Uploaded: " + res.data.url);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">

      <button onClick={startRecording} className="bg-green-500 px-6 py-3 rounded text-white">
        🎤 Start
      </button>

      <button onClick={stopRecording} className="bg-red-500 px-6 py-3 rounded text-white">
        ⏹ Stop
      </button>

      {audioURL && <audio controls src={audioURL} />}

      <button onClick={handleUpload} className="bg-blue-500 px-6 py-3 rounded text-white">
        ⬆ Upload
      </button>

      {loading && <p>Uploading...</p>}
    </div>
  );
}