import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const uploadAudio = async (blob) => {
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");

  return API.post("/upload", formData);
};