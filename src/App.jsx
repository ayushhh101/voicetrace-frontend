import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Added this
import Home from "./pages/Home";
import Ledger from "./pages/Ledger"; // Added this
import Navbar from "./components/Navbar";
import VoiceAction from "./pages/VoiceAction";
import Insights from "./pages/Insights";
import Udhar from "./pages/Udhar";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage?.startsWith("hi") ? "hi" : "en";

  useEffect(() => {
    const beforeInstallPromptHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };
  }, []);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <BrowserRouter> {/* Wrap everything in BrowserRouter */}
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* Header - Fixed to top */}
        <header className="bg-[#0D6D5D] text-white p-4 flex justify-between items-center px-6 sticky top-0 z-50 shadow-md">
          <span className="font-bold">{t("appName")}</span>

          <label className="flex items-center gap-2">
            <span className="text-xs opacity-80">{t("language")}</span>
            <select 
              value={currentLanguage} 
              onChange={handleLanguageChange} 
              className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20 outline-none"
            >
              <option value="en" className="text-black">{t("english")}</option>
              <option value="hi" className="text-black">{t("hindi")}</option>
            </select>
          </label>
        </header>

        {/* Main - Changed to allow scrolling and Page routing */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/voice" element={<VoiceAction />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/udhar" element={<Udhar />} />
            {/* You can add /insights here later */}
          </Routes>
        </main>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}

export default App;