import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "VoiceTrace",
      downloadApp: "Download App",
      installUnavailable: "Install not available. Use 'Add to Home Screen'",
      language: "Language",
      english: "English",
      hindi: "Hindi",
      recorder: {
        start: "Start",
        stop: "Stop",
        upload: "Upload",
        uploading: "Uploading...",
        noRecordingYet: "Record audio first, then upload.",
        microphonePermissionError:
          "Could not start recording. Please allow microphone access.",
        noActiveRecording: "No active recording to stop.",
        uploadFailed: "Upload failed. Please try again.",
        speakGuide: "Speak Instructions",
        speakResult: "Speak Result",
        vendorGuideText:
          "Tap Start to record, tap Stop to finish, then tap Upload to send audio.",
        resultTitle: "Upload Result",
        uploadedUrl: "Uploaded URL",
        detectedText: "Detected Text",
        noDetectedText: "No transcript text returned by server."
      }
    }
  },
  hi: {
    translation: {
      appName: "वॉइसट्रेस",
      downloadApp: "ऐप डाउनलोड करें",
      installUnavailable: "इंस्टॉल उपलब्ध नहीं है। 'Add to Home Screen' का उपयोग करें",
      language: "भाषा",
      english: "अंग्रेज़ी",
      hindi: "हिंदी",
      recorder: {
        start: "शुरू करें",
        stop: "रोकें",
        upload: "अपलोड करें",
        uploading: "अपलोड हो रहा है...",
        noRecordingYet: "पहले ऑडियो रिकॉर्ड करें, फिर अपलोड करें।",
        microphonePermissionError:
          "रिकॉर्डिंग शुरू नहीं हो सकी। कृपया माइक्रोफोन की अनुमति दें।",
        noActiveRecording: "रोकने के लिए कोई सक्रिय रिकॉर्डिंग नहीं है।",
        uploadFailed: "अपलोड विफल हुआ। कृपया दोबारा कोशिश करें।",
        speakGuide: "निर्देश सुनें",
        speakResult: "परिणाम सुनें",
        vendorGuideText:
          "रिकॉर्ड करने के लिए शुरू करें दबाएं, खत्म करने के लिए रोकें दबाएं, फिर ऑडियो भेजने के लिए अपलोड करें दबाएं।",
        resultTitle: "अपलोड परिणाम",
        uploadedUrl: "अपलोड किया गया URL",
        detectedText: "पहचाना गया टेक्स्ट",
        noDetectedText: "सर्वर से ट्रांसक्रिप्ट टेक्स्ट नहीं मिला।"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "hi"],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "vt-lang",
      caches: ["localStorage"]
    }
  });

export default i18n;