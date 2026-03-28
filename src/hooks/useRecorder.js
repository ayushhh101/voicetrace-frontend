import { useRef, useState } from "react";

export const useRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [audioURL, setAudioURL] = useState(null);
  const [blob, setBlob] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
  };

  return { startRecording, stopRecording, audioURL, blob };
};