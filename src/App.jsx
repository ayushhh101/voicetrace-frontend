import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white p-4 text-center flex justify-between items-center gap-3">
        <span>{t("appName")} 🎤</span>

        <label className="flex items-center gap-2">
          <span>{t("language")}</span>
          <select value={currentLanguage} onChange={handleLanguageChange} className="text-black px-2 py-1 rounded">
            <option value="en">{t("english")}</option>
            <option value="hi">{t("hindi")}</option>
          </select>
        </label>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center">
        <Home />
      </main>
    </div>
  );
}

export default App;