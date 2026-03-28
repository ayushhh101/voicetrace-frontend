import { useRef, useState } from "react";

export const useRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const [audioURL, setAudioURL] = useState(null);
  const [blob, setBlob] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
        chunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      return true;
    } catch {
      return false;
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return false;
    if (mediaRecorderRef.current.state === "inactive") return false;
    mediaRecorderRef.current.stop();
    return true;
  };

  return { startRecording, stopRecording, audioURL, blob };
};