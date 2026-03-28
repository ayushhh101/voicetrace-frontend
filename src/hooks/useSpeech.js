const HI_LANG = "hi-IN";
const EN_LANG = "en-IN";

const getVoiceForLang = (lang) => {
  const voices = window.speechSynthesis.getVoices();
  const exact = voices.find((voice) => voice.lang === lang);
  if (exact) return exact;

  const closeMatch = voices.find((voice) => voice.lang?.startsWith(lang.split("-")[0]));
  return closeMatch || null;
};

export const useSpeech = () => {
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speakText = (text, appLanguage) => {
    if (!isSupported || !text) return false;

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = appLanguage === "hi" ? HI_LANG : EN_LANG;

    utterance.lang = lang;
    const voice = getVoiceForLang(lang);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return true;
  };

  return {
    isSupported,
    speakText
  };
};